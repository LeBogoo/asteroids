import { GameObject } from "./gameobject";
import type { Face } from "./interfaces/face";
import type { Vector } from "./vector";
import * as Utils from "./utils";
import { SoundManager } from "./soundmanger";
import { Bullet } from "./bullet";
import { Spaceship } from "./spaceship";

export class Fragment extends GameObject {
  customVelocity: Vector;
  face: Face;
  deathTime: number;
  health: number = 1;

  constructor(pos: Vector, radius: number, face: Face, velocity: Vector) {
    super(pos, 0, radius);
    this.face = face;
    this.customVelocity = velocity;

    this.targetAngularVelocity = 20;

    this.deathTime = 5 + Math.random() * 10;
  }

  destroy(projectile: GameObject): void {
    SoundManager.playSoundAt("explode_small", this.position);
    super.destroy(projectile);
  }

  shouldTakeDamage(collision: GameObject): boolean {
    return collision instanceof Bullet || collision instanceof Spaceship;
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();
    const fragment = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    const points = this.face.map((point) => `${point.x},${point.y}`).join(" ");
    fragment.setAttribute("points", points);

    fragment.setAttribute("stroke", "white");
    fragment.setAttribute("stroke-width", "1");

    element.appendChild(fragment);

    return element;
  }

  update(deltaTime: number): void {
    this.lifeTime += deltaTime;
    this.angularVelocity = Utils.lerp(this.angularVelocity, this.targetAngularVelocity, 0.05);
    this.position.x += this.customVelocity.x * deltaTime;
    this.position.y += this.customVelocity.y * deltaTime;
    this.rotation += this.angularVelocity * deltaTime;

    if (this.lifeTime > this.deathTime) {
      this.world?.removeObject(this);
    }
  }
}
