import { Particle } from '../particle/particle'
import { MsgFromMain, MsgToMain } from './messages'
import { SimulationConfig } from './Simulation'

export class SimulationWorker {
  private readonly worker: Worker = new Worker('./worker.ts')

  constructor(
    particles: Particle[],
    listener: (data: MsgToMain) => void,
    config?: Partial<SimulationConfig>,
  ) {
    this.worker.addEventListener('message', e => listener(JSON.parse(e.data)))
    this.send({ type: 'init', particles, config })
  }

  public tick() {
    this.send({ type: 'tick' })
  }

  private send(message: MsgFromMain) {
    this.worker.postMessage(JSON.stringify(message))
  }
}
