import { Particle3 } from '../particle/particle-3'
import { Neighborhood } from '../simulation/neighbors'

export class Points {
  constructor(group: THREE.Group) {
    console.log(this, group)
  }

  public update(particles: Particle3[], neighborhood: Neighborhood) {
    console.log(this, particles, neighborhood)
  }
}
