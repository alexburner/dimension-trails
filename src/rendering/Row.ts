import * as THREE from 'three'

import { Neighborhood } from './../simulation/neighbors'
import { Particle3 } from './particle3'

export class Row {
  private readonly group: THREE.Group

  constructor(x, y, z) {
    this.group = new THREE.Group()
    console.log(x, y, z)
  }

  public getObject(): THREE.Object3D {
    return this.group
  }

  public update(particles: Particle3[], neighborhood: Neighborhood) {
    console.log(particles, neighborhood)
  }

  public rotate() {
    console.log('rotate')
  }
}
