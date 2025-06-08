import type { GameObject } from "./gameobject";
import { Spaceship } from "./spaceship";
import { Vector } from "./vector";
import type { World } from "./world";

export interface GameRendererOptions {
  width?: number;
  height?: number;
  zoom?: number;
  resize?: boolean;
  focus?: GameObject;
}

interface KnownGameRendererOptions extends GameRendererOptions {
  width: number;
  height: number;
  zoom: number;
}

export class GameRenderer {
  private world: World;
  private svgElement: SVGSVGElement;
  private healthContainer!: SVGGElement;
  private fragmentsText!: SVGTextElement;
  private versionText!: SVGTextElement;
  private options: KnownGameRendererOptions;
  private offset: Vector = Vector.zero();

  constructor(world: World, options: GameRendererOptions) {
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
      window.addEventListener("resize", this.resize.bind(this));
      this.resize();
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

    this.createGui();
  }

  private createGui() {
    // create 20 rectangles next to each other with a bit of space between them
    const healthHeight = 20;
    const singleHealthWidth = 10;
    const healthOffset = 5;
    const skew = 20;
    const outlinePadding = 4;

    this.healthContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.healthContainer.setAttribute(
      "width",
      `${20 * singleHealthWidth + 19 * healthOffset + skew + 2 * outlinePadding}`
    );
    this.healthContainer.setAttribute("height", `${healthHeight + 2 * outlinePadding}`);
    this.healthContainer.setAttribute("style", "pointer-events: none;");

    const healthbarOutline = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    healthbarOutline.setAttribute(
      "points",
      `${-outlinePadding},${-outlinePadding}
      ${20 * singleHealthWidth + 19 * healthOffset + outlinePadding},${-outlinePadding}
      ${20 * singleHealthWidth + 19 * healthOffset + skew + 2 * outlinePadding},${healthHeight + outlinePadding}
      ${-outlinePadding},${healthHeight + outlinePadding}`
    );
    healthbarOutline.setAttribute("fill", "none");
    healthbarOutline.setAttribute("stroke", "white");
    healthbarOutline.setAttribute("stroke-width", "2");
    this.healthContainer.appendChild(healthbarOutline);

    for (let i = 0; i < 20; i++) {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      const x1 = i * (singleHealthWidth + healthOffset);
      const x2 = x1 + singleHealthWidth;
      const bottomLeftSkew = i === 0 ? 0 : skew;
      const points = `${x1},0 ${x2},0 ${x2 + skew},${healthHeight} ${x1 + bottomLeftSkew},${healthHeight}`;
      polygon.setAttribute("points", points);
      polygon.setAttribute("data-health-indicator", "true");

      if (i < 3) polygon.setAttribute("data-color", "rgb(255, 0, 0)");
      else if (i < 10) polygon.setAttribute("data-color", "rgb(238, 154, 0)");
      else polygon.setAttribute("data-color", "rgb(95, 227, 0)");

      this.healthContainer.appendChild(polygon);
    }

    this.svgElement.appendChild(this.healthContainer);

    this.fragmentsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.fragmentsText.setAttribute("font-size", "20");
    this.fragmentsText.setAttribute("font-family", "monospace");
    this.fragmentsText.setAttribute("fill", "white");
    this.fragmentsText.setAttribute("text-anchor", "end");
    this.fragmentsText.setAttribute("dominant-baseline", "hanging");
    this.svgElement.appendChild(this.fragmentsText);

    this.versionText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.versionText.setAttribute("font-size", "12");
    this.versionText.setAttribute("font-family", "monospace");
    this.versionText.setAttribute("fill", "white");
    this.versionText.setAttribute("text-anchor", "end");
    this.versionText.setAttribute("dominant-baseline", "auto");
    this.versionText.setAttribute("opacity", "0.25");

    this.versionText.textContent = import.meta.env.VITE_VERSION + "-" + import.meta.env.VITE_HASH;
    this.svgElement.appendChild(this.versionText);
  }

  resize() {
    this.options.width = window.innerWidth;
    this.options.height = window.innerHeight;
    this.svgElement.setAttribute("width", `${this.options.width}`);
    this.svgElement.setAttribute("height", `${this.options.height}`);
  }

  updateObjects() {
    for (let gameObject of this.world.getObjects()) {
      gameObject.updateElement();
    }
  }

  updateOffset() {
    if (this.options.focus) {
      this.offset.x = this.options.focus.position.x - this.options.width / this.options.zoom / 2;
      this.offset.y = this.options.focus.position.y - this.options.height / this.options.zoom / 2;
    }
  }

  updateGui() {
    this.healthContainer.setAttribute(
      "transform",
      `translate(${this.offset.x + 10}, ${this.offset.y + this.options.height / this.options.zoom - 20 - 10})`
    );

    const health = this.options.focus?.health || 0;
    const polygons = this.healthContainer.querySelectorAll<SVGPolygonElement>("polygon[data-health-indicator]");
    polygons.forEach((polygon, index) => {
      if (index < health) {
        polygon.setAttribute("fill", polygon.getAttribute("data-color") || "rgb(255, 0, 0)");
      } else {
        polygon.setAttribute("fill", "rgb(33, 33, 33)");
      }
    });

    if (this.options.focus instanceof Spaceship) {
      const spaceship = this.options.focus as Spaceship;
      this.fragmentsText.textContent = `Score: ${spaceship.fragmentsDestroyed}`;
      this.fragmentsText.setAttribute(
        "transform",
        `translate(
          ${this.absoluteX(this.options.width / 2 / this.options.zoom - 10)},
          ${this.absoluteY(-this.options.height / 2 / this.options.zoom + 10)}
        )`
      );
    }

    this.versionText.setAttribute(
      "transform",
      `translate(
        ${this.absoluteX(this.options.width / 2 / this.options.zoom - 10)},
          ${this.absoluteY(this.options.height / 2 / this.options.zoom - 10)}
      )`
    );
  }

  updateViewbox() {
    this.svgElement.setAttribute(
      "viewBox",
      `${this.offset.x} ${this.offset.y} ${this.options.width / this.options.zoom} ${
        this.options.height / this.options.zoom
      }`
    );
  }

  private absoluteX(value: number) {
    return value + this.offset.x + this.options.width / 2 / this.options.zoom;
  }

  private absoluteY(value: number) {
    return value + this.offset.y + this.options.height / 2 / this.options.zoom;
  }

  render() {
    this.updateObjects();
    this.updateOffset();
    this.updateGui();
    this.updateViewbox();
  }
}
