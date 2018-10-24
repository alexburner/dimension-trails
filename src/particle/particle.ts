import { map, times } from '../util'
import { assign, radialRandomVector, Vector } from './vector-n'

export interface Particle {
  dimensions: number
  position: Vector
  velocity: Vector
  acceleration: Vector
}

export const makeFreshParticles = (
  dimensions: number,
  radius: number,
  count: number,
): Particle[] => times(count, () => makeFreshParticle(dimensions, radius))

export const makeFilledParticles = (
  dimensions: number,
  radius: number,
  oldParticles: Particle[],
): Particle[] =>
  map(oldParticles, oldP => makeFilledParticle(dimensions, radius, oldP))

const makeFreshParticle = (dimensions: number, radius: number): Particle => ({
  dimensions,
  position: radialRandomVector(dimensions, radius / 2),
  velocity: radialRandomVector(dimensions, 0.5),
  acceleration: radialRandomVector(dimensions, 0.5),
})

const makeFilledParticle = (
  dimensions: number,
  radius: number,
  oldP: Particle,
): Particle => {
  const newP = makeFreshParticle(dimensions, radius)
  newP.position = assign(newP.position, oldP.position)
  newP.velocity = assign(newP.velocity, oldP.velocity)
  newP.acceleration = assign(newP.acceleration, oldP.acceleration)
  return newP
}
