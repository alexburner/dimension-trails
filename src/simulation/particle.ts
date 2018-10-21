import { map, each, times } from "../util";
import { Particle } from "./particle";
import { radialRandomize, backfill } from "./vector-n";

export interface Particle {
  dimensions: number;
  position: Float32Array;
  velocity: Float32Array;
  acceleration: Float32Array;
}

const FILL_PROPS: (keyof Particle)[] = ["position", "velocity", "dimensions"];

const makeFreshParticle = (dimensions: number): Particle => ({
  dimensions,
  position: radialRandomize(new Float32Array(dimensions)),
  velocity: radialRandomize(new Float32Array(dimensions)),
  acceleration: radialRandomize(new Float32Array(dimensions))
});

export const makeFreshParticles = (
  dimensions: number,
  count: number
): Particle[] => times(count, () => makeFreshParticle(dimensions));

export const makeFilledParticles = (
  dimensions: number,
  oldParticles: Particle[]
): Particle[] =>
  map(oldParticles, oldParticle => {
    const newParticle = makeFreshParticle(dimensions);
    each(
      FILL_PROPS,
      prop =>
        (newParticle[prop] = backfill(
          newParticle[prop] as Float32Array,
          oldParticle[prop] as Float32Array
        ))
    );
    return newParticle;
  });
