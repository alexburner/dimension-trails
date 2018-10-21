import { SimulationData3 } from '../../simulation/Simulation'
import { each } from '../../util'
import { Trails } from './Trails'

const TRAIL_GAP = 1 / 2

export class TimeTrails extends Trails {
  public update(data: SimulationData3) {
    // Give each existing particle a nudge in z space
    each(this.particleQueues, particleQueue => {
      each(particleQueue.values(), particle => {
        particle.position.z -= TRAIL_GAP
      })
    })

    // Plain Trail update
    super.update(data)
  }
}
