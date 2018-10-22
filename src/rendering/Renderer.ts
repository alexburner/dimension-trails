import * as THREE from 'three'

const NEAR = 1
const FAR = 5000
const ZOOM = 7
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
    this.camera.position.z = 40 * ZOOM

    // Let there be light
    const light = new THREE.PointLight(0xffffff, 0.7, 1000, 2)
    light.position.set(0, 0, 50)
    this.scene.add(light)
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.1))
  }

  public addObject(object: THREE.Object3D) {
    this.scene.add(object)
  }

  public render() {
    this.renderer.render(this.scene, this.camera)
  }
}
