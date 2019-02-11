import * as THREE from 'three'

import { times } from '../../util'

const material = new THREE.LineBasicMaterial({
  blending: THREE.AdditiveBlending,
  transparent: true,
  color: 0x309bff,
  opacity: 0.4,
})

export const makeSquarePlane = (radius: number): THREE.Object3D =>
  makePlane([
    // x axis
    [-radius, 0, 0],
    [radius, 0, 0],
    // y axis
    [0, -radius, 0],
    [0, radius, 0],
    // square
    [radius, -radius, 0],
    [radius, radius, 0],
    [-radius, -radius, 0],
    [-radius, radius, 0],
    [-radius, -radius, 0],
    [radius, -radius, 0],
    [-radius, radius, 0],
    [radius, radius, 0],
  ])

export const makeLongPlane = (radius: number, length: number): THREE.Object3D =>
  makePlane([
    // y axis
    [0, -length, 0],
    [0, length, 0],
    // rectangle
    [radius, -length, 0],
    [radius, length, 0],
    [-radius, -length, 0],
    [-radius, length, 0],
    [-radius, -length, 0],
    [radius, -length, 0],
    // [-radius, length, 0],
    // [radius, length, 0],
  ])

const makePlane = (vectors: [number, number, number][]): THREE.Object3D => {
  const group = new THREE.Group()
  times(vectors.length, i => {
    if (i % 2) return // only do evens, each pair
    const source = new THREE.Vector3(...vectors[i])
    const target = new THREE.Vector3(...vectors[i + 1])
    const line = new THREE.Line(new THREE.Geometry(), material)
    const geometry = line.geometry as THREE.Geometry
    line.computeLineDistances()
    geometry.vertices = [source, target]
    geometry.verticesNeedUpdate = true
    group.add(line)
  })

  return group
}
