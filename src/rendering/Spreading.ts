import * as THREE from 'three'

import { SimulationData3 } from '../simulation/Simulation'
import { makeLongPlane, makeSquarePlane } from './layers/plane'
import { Points } from './layers/Points'
import { TimeTrails } from './layers/TimeTrails'
import { SpaceArgs } from './Row'

const ROTATE_AXIS = new THREE.Vector3(0, 0, 1)

export class Spreading {
  private readonly group: THREE.Group
  private readonly points: Points
  private readonly timeTrails: TimeTrails

  constructor({ radius, x, y, z }: SpaceArgs) {
    const squarePlane = makeSquarePlane(radius)
    const longPlane = makeLongPlane(radius, 100)
    longPlane.position.z -= 100
    longPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
    this.points = new Points()
    this.timeTrails = new TimeTrails()
    this.group = new THREE.Group()
    this.group.add(squarePlane)
    this.group.add(longPlane)
    this.group.add(this.points.getObject())
    this.group.add(this.timeTrails.getObject())
    this.group.position.set(x, y, z)
    this.group.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
    this.group.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
  }

  public update(data: SimulationData3) {
    this.points.update(data)
    this.timeTrails.update(data)
  }

  public getObject(): THREE.Object3D {
    return this.group
  }

  public rotate(spin: number) {
    this.group.rotateOnAxis(ROTATE_AXIS, -spin)
  }
}
