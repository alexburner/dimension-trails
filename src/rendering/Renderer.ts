import * as THREE from 'three'

const NEAR = 1
const FAR = 5000
const ZOOM = 6
const VIEWANGLE = 45

export class Renderer {
  public renderer: THREE.WebGLRenderer
  public camera: THREE.PerspectiveCamera
  public scene: THREE.Scene

  constructor(canvas: HTMLCanvasElement) {
    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true

    // Set up scene
    this.scene = new THREE.Scene()

    // Set up camera
    const bounds = canvas.getBoundingClientRect()
    this.camera = new THREE.PerspectiveCamera(
      VIEWANGLE,
      bounds.width / bounds.height,
      NEAR,
      FAR,
    )
    this.camera.position.x = 0
    this.camera.position.y = 7 * ZOOM
    this.camera.position.z = 40 * ZOOM
  }

  public addObject(object: THREE.Object3D) {
    this.scene.add(object)
  }

  public render() {
    this.renderer.render(this.scene, this.camera)
  }
}
