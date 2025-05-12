import { GameObject } from "./gameobject";
import type { Vector } from "./interfaces/vector";
import * as Utils from "./utils";

export class Spaceship extends GameObject {
  type = "spaceship";
  lastShot: number = 0;

  constructor(id: string, pos: Vector, angle: number) {
    super(id, pos, angle, 15);
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();
    const hull = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const hullPoints = [
      Utils.getVectorFromAngle(0, this.radius),
      Utils.getVectorFromAngle(140, this.radius),
      Utils.getVectorFromAngle(180, this.radius * 0.5),
      Utils.getVectorFromAngle(-140, this.radius),
    ];
    const points = hullPoints.map((point) => `${point.x},${point.y}`).join(" ");
    hull.setAttribute("points", points);

    hull.setAttribute("stroke", "white");
    hull.setAttribute("stroke-width", "1");

    element.appendChild(hull);

    return element;
  }

  static fromObject(obj: any): Spaceship {
    const spaceship = new Spaceship("", { x: 0, y: 0 }, 0);
    Object.assign(spaceship, obj);
    return spaceship;
  }
}
