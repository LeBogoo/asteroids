import { GlobalOptions } from "../global-options";
import type { GameObject } from "./gameobjects/gameobject";
import { Spaceship } from "./gameobjects/spaceship";
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
  private fuelContainer?: SVGGElement;
  private fuelIndicator?: SVGRectElement;
  private gameOverText!: SVGTextElement;
  private fragmentsText!: SVGTextElement;
  private versionText!: SVGTextElement;
  private options: KnownGameRendererOptions;
  private offset: Vector = Vector.zero();

  constructor(world: World, options: GameRendererOptions) {
    this.world = world;
    this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.svgElement.setAttribute("style", "border: 2px solid " + GlobalOptions.THEME_COLOR + "; display: block;");
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
    healthbarOutline.setAttribute("stroke", GlobalOptions.THEME_COLOR);
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

    if (this.options.focus instanceof Spaceship) {
      this.fuelContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");

      this.fuelIndicator = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      this.fuelIndicator.setAttribute("width", "10");
      this.fuelIndicator.setAttribute("height", "100");
      this.fuelIndicator.setAttribute("fill", "rgb(227, 166, 0)");
      this.fuelContainer.appendChild(this.fuelIndicator);
      this.svgElement.appendChild(this.fuelContainer);

      const fuelOutline = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      fuelOutline.setAttribute("width", (10 + 2 * outlinePadding).toString());
      fuelOutline.setAttribute("height", (100 + 2 * outlinePadding).toString());
      fuelOutline.setAttribute("x", `-${outlinePadding}`);
      fuelOutline.setAttribute("y", `-${outlinePadding}`);
      fuelOutline.setAttribute("fill", "none");
      fuelOutline.setAttribute("stroke", GlobalOptions.THEME_COLOR);
      fuelOutline.setAttribute("stroke-width", "2");
      this.fuelContainer.appendChild(fuelOutline);
    }

    this.gameOverText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.gameOverText.setAttribute("font-size", "40");
    this.gameOverText.setAttribute("font-family", "monospace");
    this.gameOverText.setAttribute("fill", GlobalOptions.THEME_COLOR);
    this.gameOverText.setAttribute("text-anchor", "middle");
    this.gameOverText.setAttribute("dominant-baseline", "hanging");
    this.gameOverText.setAttribute("opacity", "0");
    this.gameOverText.textContent = "Game Over";
    this.svgElement.appendChild(this.gameOverText);

    this.fragmentsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.fragmentsText.setAttribute("font-size", "20");
    this.fragmentsText.setAttribute("font-family", "monospace");
    this.fragmentsText.setAttribute("fill", GlobalOptions.THEME_COLOR);
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

    this.fuelContainer?.setAttribute(
      "transform",
      `translate(${this.offset.x + 10}, ${this.offset.y + this.options.height / this.options.zoom - 145})`
    );

    this.gameOverText.setAttribute(
      "transform",
      `translate(${this.absoluteX(0)}, ${this.absoluteY(-this.options.zoom * 100)})`
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
      const fuel = spaceship.fuel;
      this.fuelIndicator!.setAttribute("height", fuel.toString());
      this.fuelIndicator!.setAttribute("y", (100 - fuel).toString());

      if (spaceship.isDestroyed || spaceship.isOutOfFuel) {
        this.gameOverText.setAttribute("opacity", "1");
        this.gameOverText.textContent = spaceship.isDestroyed
          ? "Game Over: Spaceship Destroyed"
          : "Game Over: Out of Fuel";
      }
    }

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
