import { Vector } from '../simulation/vector-n'
import { Particle } from './particle'

/**
 * TypedArrays are converted to objects by JSON stringification
 * ex: [0.5, 0.5, 0.5] -> { 0: 0.5, 1: 0.5, 2: 0.5 }
 */
interface VectorMsg {
  [index: number]: number
}

export interface ParticleMsg {
  dimensions: number
  position: VectorMsg
  velocity: VectorMsg
  acceleration: VectorMsg
}

export const toParticle = ({
  dimensions,
  position,
  velocity,
  acceleration,
}: ParticleMsg): Particle => ({
  dimensions,
  position: toVector(position),
  velocity: toVector(velocity),
  acceleration: toVector(acceleration),
})

const toVector = (msg: VectorMsg): Vector => {
  let i = 0
  const list = []
  while (msg[i] !== undefined) {
    list[i] = msg[i]
    i++
  }
  return new Float32Array(list)
}
