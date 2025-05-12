import { GameObject } from "./gameobject";
import type { Vector } from "./interfaces/vector";
import * as Utils from "./utils";

const BULLET_SPEED = 500;

export class Bullet extends GameObject {
  type = "bullet";
  spawnTime: number = 0;

  constructor(id: string, pos: Vector, angle: number) {
    super(id, pos, angle, 2);
    this.targetVelocity = BULLET_SPEED;
    this.velocity = BULLET_SPEED;
    this.spawnTime = Date.now();
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();
    const hull = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const hullPoints = [
      Utils.getVectorFromAngle(0, this.radius * 1.5),
      Utils.getVectorFromAngle(90, this.radius * 0.5),
      Utils.getVectorFromAngle(180, this.radius),
      Utils.getVectorFromAngle(270, this.radius * 0.5),
    ];
    const points = hullPoints.map((point) => `${point.x},${point.y}`).join(" ");
    hull.setAttribute("points", points);

    hull.setAttribute("stroke", "white");
    hull.setAttribute("stroke-width", "1");

    element.appendChild(hull);

    return element;
  }

  static fromObject(obj: any): Bullet {
    const bullet = new Bullet("", { x: 0, y: 0 }, 0);
    Object.assign(bullet, obj);
    return bullet;
  }
}
