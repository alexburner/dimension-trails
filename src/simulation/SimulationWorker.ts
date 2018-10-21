import { Particle } from "./particle";
import { SimulationData, WorkerMessage } from "./simulation-worker";

export class SimulationWorker {
  private readonly worker: Worker = new Worker("./simulation-worker.ts");

  constructor(particles: Particle[], listener: (data: SimulationData) => void) {
    this.worker.addEventListener("message", e => listener(e.data));
    this.send({ type: "init", particles });
  }

  public tick() {
    this.send({ type: "tick" });
  }

  private send(message: WorkerMessage) {
    this.worker.postMessage(message);
  }
}
