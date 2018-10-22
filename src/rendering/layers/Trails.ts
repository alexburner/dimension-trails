import * as THREE from 'three'

import { cloneParticle3, Particle3 } from '../../particle/particle-3'
import { SimulationData3 } from '../../simulation/Simulation'
import { each, RecentQueue } from '../../util'

export type ParticleQueue = RecentQueue<Particle3>

const TRAIL_LENGTH = 400
const MAX_COUNT = TRAIL_LENGTH * 100
const DOT_SIZE = 1

const texture = ((): THREE.Texture => {
  const size = 256
  const padding = 4
  const radius = size / 2 - padding
  const center = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Failed to get 2d canvas context')
  context.beginPath()
  context.arc(center, center, radius, 0, 2 * Math.PI)
  context.fillStyle = 'rgba(255, 255, 255, 1)'
  context.fill()
  return new THREE.CanvasTexture(canvas)
})()

export class Trails {
  protected trailLength: number = TRAIL_LENGTH
  protected particleQueues: ParticleQueue[] = []
  private readonly positions: Float32Array
  private readonly posAttr: THREE.BufferAttribute
  private readonly geometry: THREE.BufferGeometry
  private readonly pointCloud: THREE.Points

  constructor() {
    this.positions = new Float32Array(MAX_COUNT * 3)
    this.posAttr = new THREE.BufferAttribute(this.positions, 3).setDynamic(true)
    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', this.posAttr)
    this.geometry.setDrawRange(0, 0)
    this.pointCloud = new THREE.Points(
      this.geometry,
      new THREE.PointsMaterial({
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
        map: texture,
        size: DOT_SIZE,
      }),
    )
  }

  public update({ particles }: SimulationData3) {
    // (maybe) Grow queue to fit
    while (this.particleQueues.length < particles.length) {
      this.particleQueues.push(new RecentQueue<Particle3>(this.trailLength))
    }

    // (maybe) Shrink queue to fit
    while (this.particleQueues.length > particles.length) {
      this.particleQueues.pop()
    }

    // Add new particles to queue
    each(this.particleQueues, (particleQueue, i) => {
      particleQueue.add(cloneParticle3(particles[i]))
    })

    // Update rendered positions
    let drawCount = 0
    each(this.particleQueues, particleQueue => {
      each(particleQueue.values(), particle => {
        this.positions[drawCount * 3 + 0] = particle.position.x
        this.positions[drawCount * 3 + 1] = particle.position.y
        this.positions[drawCount * 3 + 2] = particle.position.z
        drawCount++
      })
    })
    this.geometry.setDrawRange(0, drawCount)
    this.posAttr.needsUpdate = true
  }

  public clear(): void {
    this.geometry.setDrawRange(0, 0)
    this.particleQueues = []
  }

  public getObject(): THREE.Object3D {
    return this.pointCloud
  }
}
