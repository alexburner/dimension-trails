import { Particle } from '../particle/particle'
import { MsgFromMain, MsgToMain } from './messages'
import { SimulationConfig } from './Simulation'

export class SimulationWorker {
  private readonly worker: Worker = new Worker('./worker.ts')

  constructor(listener: (data: MsgToMain) => void) {
    this.worker.addEventListener('message', e => listener(JSON.parse(e.data)))
  }

  public init(particles: Particle[], config?: Partial<SimulationConfig>) {
    this.send({ type: 'init', particles, config })
  }

  public tick() {
    this.send({ type: 'tick' })
  }

  private send(message: MsgFromMain) {
    this.worker.postMessage(JSON.stringify(message))
  }
}
