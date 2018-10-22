import * as THREE from 'three'

import { times } from '../../util'

export const makePlane = (radius: number): THREE.Object3D => {
  const material = new THREE.LineDashedMaterial({
    blending: THREE.AdditiveBlending,
    color: 0xffffff,
    depthTest: false,
    transparent: true,
    opacity: 0.2,
    dashSize: 0.8,
    gapSize: 0.8,
  })

  const specs = [
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
  ]

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
