import { each, map, times } from '../util'
import { backfill, radialRandomVector, Vector } from './vector-n'

export interface Particle {
  dimensions: number
  position: Vector
  velocity: Vector
  acceleration: Vector
}

const FILL_PROPS: (keyof Particle)[] = ['position', 'velocity', 'acceleration']

const makeFreshParticle = (dimensions: number): Particle => ({
  dimensions,
  position: radialRandomVector(dimensions),
  velocity: radialRandomVector(dimensions),
  acceleration: radialRandomVector(dimensions),
})

export const makeFreshParticles = (
  dimensions: number,
  count: number,
): Particle[] => times(count, () => makeFreshParticle(dimensions))

export const makeFilledParticles = (
  dimensions: number,
  oldParticles: Particle[],
): Particle[] =>
  map(oldParticles, oldParticle => {
    const newParticle = makeFreshParticle(dimensions)
    each(
      FILL_PROPS,
      prop =>
        (newParticle[prop] = backfill(
          newParticle[prop] as Vector,
          oldParticle[prop] as Vector,
        )),
    )
    return newParticle
  })
