import type { GameObject } from "./gameobject";
import type { World } from "./world";

interface WorldRendererOptions {
  width?: number;
  height?: number;
  zoom?: number;
  resize?: boolean;
}

interface KnownWorldRendererOptions extends WorldRendererOptions {
  width: number;
  height: number;
  zoom: number;
}

export class WorldRenderer {
  private world: World;
  private svgElement: SVGSVGElement;
  focusObject: GameObject;
  private options: KnownWorldRendererOptions;

  constructor(world: World, focusObject: GameObject, options: WorldRendererOptions) {
    this.world = world;
    this.focusObject = focusObject;
    this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.svgElement.setAttribute("style", "border: 1px solid white; display: block;");
    document.body.appendChild(this.svgElement);

    this.options = {
      width: options.width || 200,
      height: options.height || 200,
      zoom: options.zoom || 1,
      resize: options.resize,
    };

    if (options.resize) {
      window.addEventListener("resize", this.resizeGameArea.bind(this));
      this.resizeGameArea();
    } else {
      this.svgElement.setAttribute("width", `${this.options.width}`);
      this.svgElement.setAttribute("height", `${this.options.height}`);
    }

    world.onAdd = (gameObject: GameObject) => {
      this.svgElement.appendChild(gameObject.getElement());
    };

    world.onRemove = (gameObject: GameObject) => {
      this.svgElement.removeChild(gameObject.getElement());
    };
  }

  resizeGameArea() {
    this.options.width = window.innerWidth;
    this.options.height = window.innerHeight;
    this.svgElement.setAttribute("width", `${this.options.width}`);
    this.svgElement.setAttribute("height", `${this.options.height}`);
  }

  render() {
    for (let gameObject of this.world.getObjects()) {
      gameObject.updateElement();
    }

    let xOffset = this.focusObject.position.x - this.options.width / 2;
    let yOffset = this.focusObject.position.y - this.options.height / 2;
    this.svgElement.setAttribute("viewBox", `${xOffset} ${yOffset} ${this.options.width} ${this.options.height}`);
  }
}
