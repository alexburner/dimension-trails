import { each, reduce } from '../../util'
import { getMagnitudeSq, multiply } from './../vector-n'
import { Bounding } from './bounding'

export const centerScaling: Bounding = (particles, radius) => {
  if (particles.length < 1) return

  // Avoid Math.sqrt
  const radiusSq = radius * radius

  // Find longest distance between individual particle & origin
  const largestMagnitudeSq = reduce(
    particles,
    (memo: number, p) => Math.max(memo, getMagnitudeSq(p.position)),
    0,
  )

  // Abort if already within limits
  if (largestMagnitudeSq <= radiusSq) return

  // Scale down all particle positions
  const factor = radiusSq / largestMagnitudeSq
  each(particles, p => (p.position = multiply(p.position, factor)))
}
