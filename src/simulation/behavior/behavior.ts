import { Neighborhood } from './../neighbors'
import { Particle } from '../particle'
import { OrbitsSpec, orbits } from './orbits'

export type BehaviorSpecs = OrbitsSpec

export type Behavior<Spec extends BehaviorSpecs> = (
  particles: Particle[],
  neighborhood: Neighborhood,
  config: Spec['config'],
) => void

export enum BehaviorNames {
  Orbits = 'orbits',
}

const behaviors: { [name in BehaviorNames]: Behavior<BehaviorSpecs> } = {
  orbits,
}

export const behavior = (
  particles: Particle[],
  neighborhood: Neighborhood,
  spec: BehaviorSpecs,
) => behaviors[spec.name](particles, neighborhood, spec.config)
