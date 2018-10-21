import { getNeighborhood } from '../particle/neighbors'
import { toParticle } from '../particle/particle-msg'
import { assertNever, map } from '../util'
import { MsgFromWorker, MsgToWorker } from './messages'
import { Simulation } from './Simulation'

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
const context = (self as any) as DedicatedWorkerGlobalScope

const simulation = new Simulation()

const send = (msg: MsgFromWorker) => context.postMessage(JSON.stringify(msg))

context.addEventListener('message', (e: MessageEvent) => {
  const message = JSON.parse(e.data) as MsgToWorker
  switch (message.type) {
    case 'init': {
      const particles = map(message.particles, toParticle)
      const neighborhood = getNeighborhood(particles)
      simulation.init(particles, neighborhood, message.config)
      break
    }

    case 'tick': {
      simulation.tick()
      send(simulation.getData())
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
