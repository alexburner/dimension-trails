import * as THREE from 'three'

import { Particle3 } from '../particle/particle-3'
import { Neighborhood } from './../particle/neighbors'
import { Sitting } from './Sitting'
import { Spreading } from './Spreading'

export class Row {
  private readonly group: THREE.Group
  private readonly sitting: Sitting
  private readonly spreading: Spreading

  constructor(width: number, height: number, x: number, y: number, z: number) {
    this.group = new THREE.Group()
    this.group.position.set(x, y, z)

    const remaining = width - height
    this.sitting = new Sitting(height, height, height / 2, 0, 0)
    this.spreading = new Spreading(
      remaining,
      height,
      remaining / 2 + height,
      0,
      0,
    )

    this.group.add(this.sitting.getObject())
    this.group.add(this.spreading.getObject())
  }

  public getObject(): THREE.Object3D {
    return this.group
  }

  public update(particles: Particle3[], neighborhood: Neighborhood) {
    this.sitting.update(particles, neighborhood)
    this.spreading.update(particles, neighborhood)
  }

  public rotate() {
    this.sitting.rotate()
    this.spreading.rotate()
  }
}
