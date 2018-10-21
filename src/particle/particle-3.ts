import * as THREE from 'three'

import { Particle } from './particle'
import { Vector } from './vector-n'

export interface Particle3 {
  dimensions: number
  position: THREE.Vector3
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
}

export const toParticle3 = ({
  dimensions,
  position,
  velocity,
  acceleration,
}: Particle): Particle3 => ({
  dimensions,
  position: toVector3(position),
  velocity: toVector3(velocity),
  acceleration: toVector3(acceleration),
})

const toVector3 = (v: Vector): THREE.Vector3 => {
  /* tslint:disable:no-magic-numbers */
  const x = v[0] || 0
  const y = v[1] || 0
  const z = v[2] || 0
  /* tslint:enable:no-magic-numbers */
  return new THREE.Vector3(x, y, z)
}
