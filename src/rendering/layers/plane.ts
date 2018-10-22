import * as THREE from 'three'

import { times } from '../../util'

const material = new THREE.LineBasicMaterial({
  blending: THREE.AdditiveBlending,
  transparent: true,
  color: 0xffffff,
  opacity: 0.2,
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

const makePlane = (specs: [number, number, number][]): THREE.Object3D => {
  const group = new THREE.Group()
  times(specs.length, i => {
    if (i % 2) return // only do evens, each pair
    const source = new THREE.Vector3(...specs[i])
    const target = new THREE.Vector3(...specs[i + 1])
    const line = new THREE.Line(new THREE.Geometry(), material)
    const geometry = line.geometry as THREE.Geometry
    line.computeLineDistances()
    geometry.vertices = [source, target]
    geometry.verticesNeedUpdate = true
    group.add(line)
  })

  return group
}
