import { coinFlip, shuffle } from "../util";

type Vector = Float32Array;
type VectorMath = (a: Vector, b: Vector | number) => Vector;
type NumberMath = (an: number, bn: number) => number;

const curryMath = (math: NumberMath): VectorMath => (a, b) => {
  const c: Vector = new Float32Array(a.length);
  const isNumB = typeof b === "number";
  for (let i = 0, l = a.length; i < l; i++) {
    const an = a[i];
    const bn = isNumB ? (b as number) : (b as Vector)[i];
    c[i] = math(an, bn);
  }
  return c;
};

export const add: VectorMath = curryMath((an, bn) => an + bn);
export const subtract: VectorMath = curryMath((an, bn) => an - bn);
export const multiply: VectorMath = curryMath((an, bn) => an * bn);
export const divide: VectorMath = curryMath((an, bn) => an / bn);

export const getDistanceSq = (a: Vector, b: Vector): number => {
  const delta = subtract(a, b);
  return getMagnitudeSq(delta);
};

export const getDistance = (a: Vector, b: Vector): number =>
  Math.sqrt(getDistanceSq(a, b));

export const getMagnitudeSq = (v: Vector): number => {
  let magnitudeSq = 0;
  for (let i = 0, l = v.length; i < l; i++) {
    magnitudeSq += v[i] * v[i];
  }
  return magnitudeSq;
};

export const getMagnitude = (v: Vector): number => Math.sqrt(getMagnitudeSq(v));

export const setMagnitude = (v: Vector, magnitude: number): Vector => {
  const prevMagnitude = getMagnitude(v);
  return prevMagnitude === 0
    ? add(v, Math.sqrt(magnitude / v.length))
    : multiply(v, magnitude / prevMagnitude);
};

export const limitMagnitude = (v: Vector, limit: number): Vector => {
  const limitSq = limit * limit;
  const currSq = getMagnitudeSq(v);
  return currSq > limitSq ? multiply(v, limitSq / currSq) : v;
};

export const getAverage = (vectors: Vector[]): Vector => {
  if (vectors.length === 0) throw new Error("Cannot average zero vectors");
  const count = vectors.length;
  const dimensions = vectors[0].length;
  const average: Vector = new Float32Array(dimensions);
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < dimensions; j++) {
      average[j] = average[j] + vectors[i][j] / count;
    }
  }
  return average;
};

export const radialRandomize = (v: Vector, radius: number = 1): Vector => {
  // Algorithm via Colin Ballast
  let result = new Float32Array(v);
  let radiusSq = radius * radius;
  for (let i = 0, l = v.length; i < l; i++) {
    const value = Math.random() * Math.sqrt(radiusSq);
    const valueSq = value * value;
    radiusSq -= valueSq;
    result[i] = coinFlip() ? value : -value;
  }
  shuffle(result);
  return result;
};

export const backfill = (newV: Vector, oldV: Vector): Vector => {
  const filled: Vector = new Float32Array(newV.length);
  for (let i = 0, l = newV.length; i < l; i++) {
    filled[i] = i < oldV.length ? oldV[i] : newV[i];
  }
  return filled;
};
