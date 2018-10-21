import {
  add,
  divide,
  getMagnitudeSq,
  multiply,
  setMagnitude,
} from '../../particle/vector-n'
import { clamp, each } from '../../util'
import { Behavior, BehaviorNames } from './behavior'

export interface OrbitsSpec {
  name: BehaviorNames.Orbits
  config: {
    mass: {
      g: number
      orbiter: number
      attractor: number
    }
    distance: {
      min: number
      max: number
    }
  }
}

export const orbits: Behavior<OrbitsSpec> = (
  particles,
  _neighborhood,
  config,
) => {
  // Attract each particle to the center
  const minDistSq = config.distance.min * config.distance.min
  const maxDistSq = config.distance.max * config.distance.max
  const mass = config.mass
  each(particles, particle => {
    let force = multiply(particle.position, -1) // vector to center
    const distanceSq = clamp(getMagnitudeSq(force), minDistSq, maxDistSq)
    const strength = (mass.g * mass.attractor * mass.orbiter) / distanceSq
    force = setMagnitude(force, strength)
    force = divide(force, config.mass.orbiter)
    particle.acceleration = add(particle.acceleration, force)
  })
}
