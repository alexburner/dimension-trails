import { toParticle3 } from "./rendering/Particle3";
import { times, each, map } from "./util";
import { SimulationWorker } from "./simulation/SimulationWorker";
import { makeFreshParticles, makeFilledParticles } from "./simulation/particle";
import { Renderer } from "./rendering/Renderer";
import { Row } from "./rendering/Row";

const DIMENSIONS = 4;
const PARTICLES = 5;

const canvas = document.getElementById("canvas");
if (!canvas) throw new Error("Failed to find canvas");

const renderer = new Renderer(canvas as HTMLCanvasElement);

const rows = times(DIMENSIONS, i => new Row(0, i * 100, 0));
each(rows, row => renderer.addObject(row.getObject()));

const particleSets: any[] = times(
  DIMENSIONS,
  (i, prevParticles) =>
    i === 0
      ? makeFreshParticles(i, PARTICLES)
      : makeFilledParticles(i, prevParticles[i - 1])
);

const workers = times(
  particleSets.length,
  i =>
    new SimulationWorker(
      particleSets[i],
      data => {
        const particles = map(data.particles, toParticle3);
        const neighborhood = data.neighborhood;
        rows[i].update(particles, neighborhood);
      }
      /**
       * When second column added:
       * data => {
       *   rowSets[0][i].update(data)
       *   // Downward projection of 4D simulation through second column
       *   if (i === 4) each(rowsSet[1], row => row.update(data))
       * }
       */
    )
);

const animationLoop = () => {
  window.requestAnimationFrame(animationLoop);
  each(workers, worker => worker.tick());
  each(rows, row => row.rotate());
  renderer.render();
};

///////////////////
animationLoop(); //
/////////////////
