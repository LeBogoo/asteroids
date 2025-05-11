import { Bullet } from "./bullet";
import { GameObject } from "./gameobject";
import type { Vector } from "./interfaces/vector";
import * as Utils from "./utils";

const SHOOT_COOLDOWN = 250;

export class Spaceship extends GameObject {
  lastShot: number = 0;

  constructor(pos: Vector, angle: number) {
    super(pos, angle, 15);
  }

  shoot(): void {
    if (Date.now() - this.lastShot < SHOOT_COOLDOWN) {
      return;
    }
    this.lastShot = Date.now();
    const pos = Utils.getVectorFromAngle(this.rotation, this.radius);
    pos.x += this.position.x;
    pos.y += this.position.y;
    const bullet = new Bullet(pos, this.rotation);
    bullet.world = this.world;
    this.world?.addObject(bullet);
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
}
