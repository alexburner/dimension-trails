import { Particle } from '../particle/particle'
import { each, map } from '../util'
import { getMagnitude, subtract, Vector } from './vector-n'

/**
 * A relation from one Particle to another
 */
export interface Neighbor {
  index: number
  distance: number
  delta: Vector
}

/**
 * Each Particle's Neighbor list, by self-same index
 */
export type Neighborhood = Neighbor[][]

/**
 * Calculate the Neighbor[] list for each Particle
 */
export const getNeighborhood = (particles: Particle[]): Neighborhood =>
  map(particles, particle => {
    const neighbors: Neighbor[] = []

    // Find relation with every other Particle
    each(particles, (other, index) => {
      if (particle === other) return
      const delta = subtract(particle.position, other.position)
      const distance = getMagnitude(delta)
      return { index, delta, distance }
    })

    // Sort relations by nearest -> furthest
    neighbors.sort((a, b) => a.distance - b.distance)

    return neighbors
  })
