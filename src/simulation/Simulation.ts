import { getNeighborhood, Neighborhood } from '../particle/neighbors'
import { Particle } from '../particle/particle'
import { add, limitMagnitude, multiply } from '../particle/vector-n'
import { each } from '../util'
import { behavior, BehaviorNames, BehaviorSpecs } from './behavior/behavior'
import { bounding, BoundingNames } from './bounding/bounding'

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

const DEFAULT_CONFIG: SimulationConfig = {
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

export class Simulation {
  private particles: Particle[] = []
  private neighborhood: Neighborhood = []
  private config: SimulationConfig = DEFAULT_CONFIG

  public init(
    particles: Particle[],
    neighborhood: Neighborhood,
    config: Partial<SimulationConfig> = {},
  ) {
    this.particles = particles
    this.neighborhood = neighborhood
    this.config = { ...this.config, ...config }
  }

  public tick() {
    // Reset accelerations
    each(this.particles, p => (p.acceleration = multiply(p.acceleration, 0)))

    // Apply particle behavior
    behavior(this.particles, this.neighborhood, this.config.behaviorSpec)

    // Update positions
    each(this.particles, p => {
      p.velocity = add(p.velocity, p.acceleration)
      p.velocity = limitMagnitude(p.velocity, this.config.max.speed)
      p.position = add(p.position, p.velocity)
    })

    // Apply particle bounding
    bounding(this.particles, this.config.max.radius, this.config.boundingName)

    // Re-calculate Particle relations
    this.neighborhood = getNeighborhood(this.particles)
  }

  public getData(): SimulationData {
    return { particles: this.particles, neighborhood: this.neighborhood }
  }
}
