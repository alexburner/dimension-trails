import * as THREE from "three";
import { Particle } from "./Particle";

export interface Particle3 {
  dimensions: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
}

export const toParticle3 = ({
  dimensions,
  position,
  velocity,
  acceleration
}: Particle): Particle3 => ({
  dimensions,
  position: toVector3(position),
  velocity: toVector3(velocity),
  acceleration: toVector3(acceleration)
});

export const toVector3 = (v: Float32Array): THREE.Vector3 => {
  const x = v[0] || 0;
  const y = v[1] || 0;
  const z = v[2] || 0;
  return new THREE.Vector3(x, y, z);
};
