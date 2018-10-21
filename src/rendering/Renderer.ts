export class Renderer {
  constructor(canvas: HTMLCanvasElement) {
    console.log(canvas);
  }

  public addObject(object: THREE.Object3D) {
    console.log(object);
  }

  public render() {
    console.log("render");
  }
}
