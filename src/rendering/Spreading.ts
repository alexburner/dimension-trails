import * as THREE from 'three'

import { SimulationData3 } from '../simulation/Simulation'
import { makePlane } from './layers/Plane'
import { Points } from './layers/Points'
import { TimeTrails } from './layers/TimeTrails'
import { SpaceArgs } from './Row'

export class Spreading {
  private readonly group: THREE.Group
  private readonly points: Points
  private readonly trails: TimeTrails

  constructor({ width, height, radius, x, y, z }: SpaceArgs) {
    const plane = makePlane(width, height, radius)
    this.points = new Points()
    this.trails = new TimeTrails()
    this.group = new THREE.Group()
    this.group.add(plane)
    this.group.add(this.points.getObject())
    this.group.add(this.trails.getObject())
    this.group.position.set(x, y, z)
    this.group.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
    this.group.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
  }

  public update(data: SimulationData3) {
    this.points.update(data)
    this.trails.update(data)
  }

  public getObject(): THREE.Object3D {
    return this.group
  }
}
