import * as THREE from 'three'

import { SimulationData3 } from '../simulation/Simulation'
import { makeSquarePlane } from './layers/plane'
import { Points } from './layers/Points'
import { Trails } from './layers/Trails'
import { SpaceArgs } from './Row'

const ROTATE_AXIS = new THREE.Vector3(0, 1, 0)

export class Sitting {
  private readonly group: THREE.Group
  private readonly points: Points
  private readonly trails: Trails

  constructor({ radius, x, y, z }: SpaceArgs) {
    const squarePlane = makeSquarePlane(radius + 2)
    this.points = new Points()
    this.trails = new Trails()
    this.group = new THREE.Group()
    this.group.add(squarePlane)
    this.group.add(this.points.getObject())
    this.group.add(this.trails.getObject())
    this.group.position.set(x, y, z)
    this.group.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
  }

  public update(data: SimulationData3) {
    this.points.update(data)
    this.trails.update(data)
  }

  public getObject(): THREE.Object3D {
    return this.group
  }

  public rotate(spin: number) {
    this.group.rotateOnAxis(ROTATE_AXIS, spin)
  }
}
