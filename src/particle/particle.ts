import { map, times } from '../util'
import { fill, radialRandomVector, Vector } from './vector-n'

export interface Particle {
  dimensions: number
  position: Vector
  velocity: Vector
  acceleration: Vector
}

export const makeFreshParticles = (
  dimensions: number,
  count: number,
): Particle[] => times(count, () => makeFreshParticle(dimensions))

export const makeFilledParticles = (
  dimensions: number,
  oldParticles: Particle[],
): Particle[] => map(oldParticles, oldP => makeFilledParticle(dimensions, oldP))

const makeFreshParticle = (dimensions: number): Particle => ({
  dimensions,
  position: radialRandomVector(dimensions, 0.5),
  velocity: radialRandomVector(dimensions, 0.5),
  acceleration: radialRandomVector(dimensions, 0.5),
})

const makeFilledParticle = (dimensions: number, oldP: Particle): Particle => {
  const newP = makeFreshParticle(dimensions)
  newP.position = fill(newP.position, oldP.position)
  newP.velocity = fill(newP.velocity, oldP.velocity)
  newP.acceleration = fill(newP.acceleration, oldP.acceleration)
  return newP
}
