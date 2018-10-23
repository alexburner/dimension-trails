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

/**
 * Shuffle array in place
 * https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
 */
export const shuffle = (list: TypedArray | any[]): void => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = list[i]
    list[i] = list[j]
    list[j] = x
  }
}

/**
 * forEach() at for-loop speeds (https://jsperf.com/array-iteration-yo)
 */
export const each = <T>(
  list: T[],
  iterator: (t: T, i: number, list: T[]) => void,
): void => {
  for (let i = 0, l = list.length; i < l; i++) {
    iterator(list[i], i, list)
  }
}

/**
 * Make a new array & fill with iterator results
 */
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

/**
 * TODO: benchmark
 */
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

/**
 * TODO: benchmark
 */
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

/**
 * Clamp a number to within a range
 */
export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n))

/**
 * ~50% probability boolean
 */
export const coinFlip = (): boolean => Boolean(Math.round(Math.random()))

/**
 * TypeScript helper to ensure exhaustive case checks
 */
export const assertNever = (value: never): never => {
  throw new TypeError(`never violation: ${JSON.stringify(value)}`)
}

/**
 * Check if a value can be cast to a Number
 */
export const isNumeric = (value: any): boolean => {
  const num = Number(value)
  return !Number.isNaN(num)
}

/**
 * Extract hash query params from URL
 */
interface Params {
  [key: string]: string | number | undefined
}
export const getHashParams = (): Params => {
  const hash = window.location.hash || ''
  if (!hash.startsWith('#')) return {}
  const parts = hash.split('#')[1].split('?')
  return reduce<string, Params>(
    parts,
    (memo, part) => {
      const [key, val] = part.split('=')
      memo[key] = isNumeric(val) ? Number(val) : val
      return memo
    },
    {},
  )
}

/**
 * Limit a list to a size, FIFO
 */
export class RecentQueue<T> {
  private readonly queue: T[] = []
  private readonly limit: number

  constructor(limit: number) {
    this.limit = limit
  }

  public add(value: T): void {
    this.queue.unshift(value)
    if (this.queue.length > this.limit) this.queue.pop()
  }

  public values(): T[] {
    return this.queue
  }
}
