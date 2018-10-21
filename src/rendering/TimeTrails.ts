import { Neighborhood } from '../simulation/neighbors'
import { Particle3 } from './Particle3'

export class TimeTrails {
  constructor(group: THREE.Group) {
    console.log(this, group)
  }

  public update(particles: Particle3[], neighborhood: Neighborhood) {
    console.log(this, particles, neighborhood)
  }
}
