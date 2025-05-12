import { GameObject } from "./gameobject";
import type { Vector } from "./interfaces/vector";
import * as Utils from "./utils";

export class Asteroid extends GameObject {
  type = "asteroid";
  customVelocity: Vector;
  points: Vector[] = [];
  constructor(id: string, pos: Vector, angle: number, radius: number, points: Vector[]) {
    super(id, pos, angle, radius);
    this.customVelocity = Utils.getVectorFromAngle(angle, 5);
    this.points = points;
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();

    // Create the asteroid shape as a polygon
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const pointsString = this.points.map((point) => `${point.x},${point.y}`).join(" ");

    polygon.setAttribute("points", pointsString);
    polygon.setAttribute("stroke", "white");
    polygon.setAttribute("stroke-width", "1");
    polygon.setAttribute("fill", "none");
    element.appendChild(polygon);

    return element;
  }

  update(deltaTime: number): void {
    this.angularVelocity = Utils.lerp(this.angularVelocity, this.targetAngularVelocity, 0.05);
    this.position.x += this.customVelocity.x * deltaTime;
    this.position.y += this.customVelocity.y * deltaTime;
    this.rotation += this.angularVelocity * deltaTime;
  }

  updateWith(gameObject: GameObject): void {
    super.updateWith(gameObject);
    this.customVelocity = (gameObject as Asteroid).customVelocity;
  }

  static fromObject(obj: any): Asteroid {
    const asteroid = new Asteroid("", { x: 0, y: 0 }, 0, 0, []);
    Object.assign(asteroid, obj);
    return asteroid;
  }
}
