import type { GameObject } from "./gameobject";
import { Vector } from "./vector";
import type { World } from "./world";

interface WorldRendererOptions {
  width?: number;
  height?: number;
  zoom?: number;
  resize?: boolean;
  focus?: GameObject;
}

interface KnownWorldRendererOptions extends WorldRendererOptions {
  width: number;
  height: number;
  zoom: number;
}

export class WorldRenderer {
  private world: World;
  private svgElement: SVGSVGElement;
  private options: KnownWorldRendererOptions;
  private offset: Vector = Vector.zero();

  constructor(world: World, options: WorldRendererOptions) {
    this.world = world;
    this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.svgElement.setAttribute("style", "border: 1px solid white; display: block;");
    document.body.appendChild(this.svgElement);

    this.options = {
      ...options,
      width: options.width || 200,
      height: options.height || 200,
      zoom: options.zoom || 1,
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
    if (this.options.focus) {
      this.offset.x = this.options.focus.position.x - this.options.width / this.options.zoom / 2;
      this.offset.y = this.options.focus.position.y - this.options.height / this.options.zoom / 2;
    }

    this.svgElement.setAttribute(
      "viewBox",
      `${this.offset.x} ${this.offset.y} ${this.options.width / this.options.zoom} ${
        this.options.height / this.options.zoom
      }`
    );
  }
}
