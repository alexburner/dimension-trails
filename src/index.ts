import { makeFilledParticles, makeFreshParticles } from './particle/particle'
import { toParticle3 } from './particle/particle-3'
import { Renderer } from './rendering/Renderer'
import { Row } from './rendering/Row'
import { SimulationWorker } from './simulation/SimulationWorker'
import { each, map, times } from './util'

const DIMENSIONS = 4
const PARTICLES = 5
const SIZE = {
  width: 900,
  height: 600,
  radius: 12,
}

//////////////////////////
// Create & insert canvas
////////////////////////
const target = document.getElementById('target')
if (!target) throw new Error('Failed to find #target')
const canvas = document.createElement('canvas')
canvas.width = SIZE.width
canvas.height = SIZE.height
target.appendChild(canvas)

///////////////////////////
// Create threejs renderer
/////////////////////////
const renderer = new Renderer(canvas)

/////////////////////////////
// Create visualization rows
///////////////////////////
const rowCount = DIMENSIONS + 1
const rowHeight = 140
const rowWidth = SIZE.width
const rows = times(
  rowCount,
  i =>
    new Row({
      width: rowWidth,
      height: rowHeight,
      radius: SIZE.radius,
      x: 0,
      y: 80 - i * (3 * SIZE.radius),
      z: 0,
    }),
)
// Add row THREE.Objects to renderer Scene
each(rows, row => renderer.addObject(row.getObject()))

///////////////////////////////////
// Create initial particle spreads
/////////////////////////////////
const particleSets: any[] = times(
  rowCount,
  (i, prevParticles) =>
    i === 0
      ? makeFreshParticles(i, PARTICLES)
      : makeFilledParticles(i, prevParticles[i - 1]),
)

/////////////////////////////////
// Create simulation web workers
///////////////////////////////
const workers = times(
  particleSets.length,
  i =>
    new SimulationWorker(
      particleSets[i],
      data => {
        const particles = map(data.particles, toParticle3)
        const neighborhood = data.neighborhood
        // Update visualization row with new data
        rows[i].update({ particles, neighborhood })
        /**
         * When second column added:
         * data => {
         *   const particles = map(data.particles, toParticle3)
         *   const neighborhood = data.neighborhood
         *   const data3 = { particles, neighborhood }
         *   rows[i].update(data3)
         *   // Downward projection of 4D simulation through second column
         *   if (i === 4) each(rowsSet[1], row => row.update(data3))
         * }
         */
      },
      { radius: SIZE.radius },
    ),
)

/////////////////////////
// Create animation loop
///////////////////////
const animationLoop = () => {
  window.requestAnimationFrame(animationLoop)
  each(workers, worker => worker.tick())
  each(rows, row => row.rotate())
  renderer.render()
}

///////////////////
animationLoop() //
/////////////////
