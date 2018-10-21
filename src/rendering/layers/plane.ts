import * as THREE from 'three'

export const makePlane = (
  width: number,
  height: number,
  radius: number,
): THREE.Object3D => {
  console.log(width, height, radius)
  return new THREE.Group()
}
