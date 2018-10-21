import { Neighborhood } from '../particle/neighbors'
import { Particle3 } from '../particle/particle-3'

export class TimeTrails {
  constructor(group: THREE.Group) {
    console.log(this, group)
  }

  public update(particles: Particle3[], neighborhood: Neighborhood) {
    console.log(this, particles, neighborhood)
  }
}
