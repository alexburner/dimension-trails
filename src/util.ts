/**
 * Polyfill for TypedArray interface
 * https://github.com/Microsoft/TypeScript/issues/15402#issuecomment-297544403
 */
type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array

export const shuffle = (list: TypedArray | any[]): void => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = list[i]
    list[i] = list[j]
    list[j] = x
  }
}

export const each = <T>(
  list: T[],
  iterator: (t: T, i: number, list: T[]) => void,
): void => {
  for (let i = 0, l = list.length; i < l; i++) {
    iterator(list[i], i, list)
  }
}

export const map = <T, U>(
  list: T[],
  iterator: (t: T, i: number, list: T[]) => U,
): U[] => {
  const output: U[] = new Array(list.length)
  for (let i = 0, l = list.length; i < l; i++) {
    output[i] = iterator(list[i], i, list)
  }
  return output
}

export const times = <T>(
  length: number,
  iterator: (i: number, list: T[]) => T,
): T[] => {
  const output: T[] = new Array(length)
  for (let i = 0; i < length; i++) {
    output[i] = iterator(i, output)
  }
  return output
}

export const reduce = <T, M>(
  list: T[],
  iterator: (memo: M, t: T, i: number, list: T[]) => M,
  memo: M,
): M => {
  for (let i = 0, l = list.length; i < l; i++) {
    memo = iterator(memo, list[i], i, list)
  }
  return memo
}

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n))

export const coinFlip = (): boolean => Math.random() < 0.5

export const assertNever = (value: never): never => {
  throw new TypeError(`never violation: ${JSON.stringify(value)}`)
}
