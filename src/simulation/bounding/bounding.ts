import { Particle } from "../particle";
import { centerScaling } from "./centerScaling";

export type Bounding = (particles: Particle[], radius: number) => void;

export enum BoundingNames {
  CenterScaling = "centerScaling"
}

const boundings: { [name in BoundingNames]: Bounding } = {
  centerScaling
};

export const bounding = (
  particles: Particle[],
  radius: number,
  name: BoundingNames
) => boundings[name](particles, radius);
