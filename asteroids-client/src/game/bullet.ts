import { Asteroid } from "./asteroid";
import { Fragment } from "./fragment";
import { GameObject } from "./gameobject";
import type { Vector } from "./interfaces/vector";
import * as Utils from "./utils";

const BULLET_SPEED = 500;
const MAX_BULLET_LIFETIME = 1000 * 2;

export class Bullet extends GameObject {
  spawnTime: number = 0;

  constructor(pos: Vector, angle: number) {
    super(pos, angle, 2);
    this.targetVelocity = BULLET_SPEED;
    this.velocity = BULLET_SPEED;
    this.spawnTime = Date.now();
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    if (Date.now() - this.spawnTime > MAX_BULLET_LIFETIME) {
      this.world?.removeObject(this);
    }

    // Check for collision with other game objects
    for (const gameObject of this.world?.getObjects() || []) {
      if (gameObject !== this && this.isColliding(gameObject)) {
        if (gameObject instanceof Asteroid) {
          gameObject.explode(this);
        }

        if (gameObject instanceof Fragment) {
          this.world?.removeObject(gameObject);
        }

        this.world?.removeObject(this);
        break;
      }
    }
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
}
