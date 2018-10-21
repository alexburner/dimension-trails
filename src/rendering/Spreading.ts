import * as THREE from 'three'

import { Neighborhood } from '../particle/neighbors'
import { Particle3 } from '../particle/particle-3'
import { Grid } from './Grid'
import { Points } from './Points'
import { TimeTrails } from './TimeTrails'

export class Spreading {
  private readonly group: THREE.Group
  private readonly grid: Grid
  private readonly points: Points
  private readonly trails: TimeTrails

  constructor(width: number, height: number, x: number, y: number, z: number) {
    this.group = new THREE.Group()
    this.group.position.set(x, y, z)
    this.grid = new Grid(this.group)
    this.points = new Points(this.group)
    this.trails = new TimeTrails(this.group)
  }

  public getObject(): THREE.Object3D {
    return this.group
  }

  public update(particles: Particle3[], neighborhood: Neighborhood) {
    this.points.update(particles, neighborhood)
    this.trails.update(particles, neighborhood)
  }

  public rotate() {
    console.log(this)
  }
}
