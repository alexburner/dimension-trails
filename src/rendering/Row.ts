import * as THREE from 'three'

import { SimulationData3 } from '../simulation/Simulation'
import { Sitting } from './Sitting'
import { Spreading } from './Spreading'

export interface SpaceArgs {
  dimensions: number
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
  private readonly spin: number

  constructor({ dimensions, radius, x, y, z }: SpaceArgs, spin: number) {
    this.spin = spin

    this.sitting = new Sitting({
      dimensions,
      radius,
      x: -110,
      y: 0,
      z: 0,
    })

    this.spreading = new Spreading({
      dimensions,
      radius,
      x: -70,
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
    this.group.rotateOnAxis(ROTATE_AXIS, this.spin)
  }

  public getObject(): THREE.Object3D {
    return this.group
  }
}
