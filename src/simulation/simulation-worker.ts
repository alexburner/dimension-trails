import { assertNever, each } from '../util'
import { behavior, BehaviorNames, BehaviorSpecs } from './behavior/behavior'
import { bounding, BoundingNames } from './bounding/bounding'
import { getNeighborhood, Neighborhood } from './neighbors'
import { Particle } from './particle'
import { add, limitMagnitude, multiply } from './vector-n'

export interface SimulationConfig {
  behaviorSpec: BehaviorSpecs
  boundingName: BoundingNames
  max: {
    force: number
    speed: number
    radius: number
  }
}

export interface SimulationData {
  particles: Particle[]
  neighborhood: Neighborhood
}

export type WorkerMessage =
  | { type: 'init'; particles: Particle[]; config?: SimulationConfig }
  | { type: 'tick' }
  | { type: 'destroy' }

/**
 * TypeScript currently does not support loading both "DOM" and "WebWorker"
 * type definitions (in the tsconfig "lib" field), so we are falling back to
 * incomplete types hacked out of the desired definitions file
 *
 * Issue:
 * https://github.com/Microsoft/TypeScript/issues/20595
 *
 * Hack:
 * node_modules/typescript/lib/lib.webworker.d.ts -> typings/custom.d.ts
 *
 * Actual:
 * https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
 *
 */
const context = self as any
// TODO const context = (self as any) as DedicatedWorkerGlobalScope;

const DEFAULT_CONFIG = {
  behaviorSpec: {
    name: BehaviorNames.Orbits,
    config: {
      mass: {
        g: 1,
        orbiter: 10,
        attractor: 30,
      },
      distance: {
        min: 50,
        max: 250,
      },
    },
  },
  boundingName: BoundingNames.CenterScaling,
  max: {
    force: 1,
    speed: 1,
    radius: 50,
  },
}

const simulation: {
  config: SimulationConfig
  data: SimulationData
} = {
  config: DEFAULT_CONFIG,
  data: {
    particles: [],
    neighborhood: [],
  },
}

const isWorkerMessage = (val: any): val is WorkerMessage =>
  val && typeof val.type === 'string' // safe enough

context.addEventListener('message', (e: MessageEvent) => {
  const message = e.data
  if (!isWorkerMessage(message)) return
  switch (message.type) {
    case 'init': {
      simulation.config = message.config || DEFAULT_CONFIG
      simulation.data.particles = message.particles
      simulation.data.neighborhood = getNeighborhood(message.particles)
      break
    }

    case 'tick': {
      tick()
      context.postMessage(simulation.data)
      break
    }

    case 'destroy': {
      context.close()
      break
    }

    default: {
      assertNever(message)
    }
  }
})

const tick = () => {
  // Reset accelerations
  each(
    simulation.data.particles,
    p => (p.acceleration = multiply(p.acceleration, 0)),
  )

  // Apply particle behavior
  behavior(
    simulation.data.particles,
    simulation.data.neighborhood,
    simulation.config.behaviorSpec,
  )

  // Update positions
  each(simulation.data.particles, p => {
    p.velocity = add(p.velocity, p.acceleration)
    p.velocity = limitMagnitude(p.velocity, simulation.config.max.speed)
    p.position = add(p.position, p.velocity)
  })

  // Apply particle bounding
  bounding(
    simulation.data.particles,
    simulation.config.max.radius,
    simulation.config.boundingName,
  )

  // Re-calculate Particle relations
  simulation.data.neighborhood = getNeighborhood(simulation.data.particles)
}
