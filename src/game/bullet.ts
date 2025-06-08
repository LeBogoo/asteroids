import { Asteroid } from "./asteroid";
import { DespawnableGameObject } from "./despawnable-game-object";
import { Fragment } from "./fragment";
import { GameObject } from "./gameobject";
import type { Random } from "./random";
import { Spaceship } from "./spaceship";
import { Vector } from "./vector";

const BULLET_SPEED = 500;
const MAX_BULLET_LIFETIME = 1000 * 2;

export class Bullet extends DespawnableGameObject {
  despawnTime: number = MAX_BULLET_LIFETIME;
  spawnTime: number = 0;
  health: number = 1;
  maxHealth: number = 1;

  constructor(random: Random, pos: Vector, angle: number) {
    super(random, pos, angle, 2);
    this.targetVelocity = BULLET_SPEED;
    this.velocity = BULLET_SPEED;
    this.spawnTime = Date.now();
  }

  shouldTakeDamage(collision: GameObject): boolean {
    if (this.parent == collision) return false;

    return collision instanceof Asteroid || collision instanceof Fragment || collision instanceof Spaceship;
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();
    const hull = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const hullPoints = [
      Vector.fromAngle(0, this.radius * 1.5),
      Vector.fromAngle(90, this.radius * 0.5),
      Vector.fromAngle(180, this.radius),
      Vector.fromAngle(270, this.radius * 0.5),
    ];
    const points = hullPoints.map((point) => `${point.x},${point.y}`).join(" ");
    hull.setAttribute("points", points);

    hull.setAttribute("stroke", "white");
    hull.setAttribute("stroke-width", "1");

    element.appendChild(hull);

    return element;
  }
}
