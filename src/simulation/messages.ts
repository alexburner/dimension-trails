import { Neighborhood } from '../particle/neighbors'
import { Particle } from '../particle/particle'
import { ParticleMsg } from '../particle/particle-msg'
import { SimulationConfig } from './Simulation'

/**
 * Note:
 *  But why all this From/To madness??
 *  Because JSON stringification silently converts TypedArrays into objects
 *  (see particle-msg.ts for example & conversion helper)
 *
 */

/**
 * Main -> Worker
 */

export type MsgFromMain =
  | {
      type: 'init'
      particles: Particle[]
      config?: Partial<SimulationConfig>
    }
  | { type: 'tick' }
  | { type: 'destroy' }

export type MsgToWorker =
  | {
      type: 'init'
      particles: ParticleMsg[]
      config?: Partial<SimulationConfig>
    }
  | { type: 'tick' }
  | { type: 'destroy' }

/**
 * Worker -> Main
 */

export interface MsgFromWorker {
  particles: Particle[]
  neighborhood: Neighborhood
}

export interface MsgToMain {
  particles: ParticleMsg[]
  neighborhood: Neighborhood
}
