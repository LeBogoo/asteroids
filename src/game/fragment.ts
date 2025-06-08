import { GameObject } from "./gameobject";
import type { Face } from "./interfaces/face";
import type { Vector } from "./vector";
import * as Utils from "./utils";
import { SoundManager } from "./soundmanger";
import { Bullet } from "./bullet";
import { Spaceship } from "./spaceship";
import { DespawnableGameObject } from "./despawnable-game-object";
import { Random } from "./random";

export class Fragment extends DespawnableGameObject {
  customVelocity: Vector;
  face: Face;
  despawnTime: number;
  health: number = 1;
  maxHealth: number = 1;

  constructor(random: Random, pos: Vector, radius: number, face: Face, velocity: Vector) {
    super(random, pos, 0, radius);
    this.face = face;
    this.customVelocity = velocity;

    this.targetAngularVelocity = 20;

    this.despawnTime = 5 + this.random.next() * 10;
  }

  destroy(projectile: GameObject): void {
    SoundManager.playSoundAt("explode_small", this.position);
    if (projectile.parent && projectile.parent instanceof Spaceship) {
      projectile.parent.fragmentsDestroyed++;
      console.log(`Fragments destroyed: ${projectile.parent.fragmentsDestroyed}`);
    }

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
    this.removeIfDead();
  }
}
