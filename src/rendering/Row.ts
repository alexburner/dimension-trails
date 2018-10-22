import * as THREE from 'three'

import { SimulationData3 } from '../simulation/Simulation'
import { Sitting } from './Sitting'
import { Spreading } from './Spreading'

export interface SpaceArgs {
  width: number
  height: number
  radius: number
  x: number
  y: number
  z: number
}

const ROTATE_AXIS = new THREE.Vector3(1, 0, 0)

export class Row {
  private readonly group: THREE.Group
  private readonly sitting: Sitting
  private readonly spreading: Spreading

  constructor({ width, height, radius, x, y, z }: SpaceArgs) {
    this.sitting = new Sitting({
      width: height,
      height,
      radius,
      x: -100,
      y: 0,
      z: 0,
    })

    this.spreading = new Spreading({
      width: width - height,
      height,
      radius,
      x: -60,
      y: 0,
      z: 0,
    })

    this.group = new THREE.Group()
    this.group.position.set(x, y, z)
    this.group.add(this.sitting.getObject())
    this.group.add(this.spreading.getObject())
  }

  public update(data: SimulationData3) {
    this.sitting.update(data)
    this.spreading.update(data)
  }

  public rotate() {
    // this.group.rotateOnAxis(ROTATE_AXIS, 0.003)
  }

  public getObject(): THREE.Object3D {
    return this.group
  }
}
