import type { Moveable } from "./interfaces/moveable";
import type { Updateable } from "./interfaces/updateable";
import type { Vector } from "./vector";
import * as Utils from "./utils";
import type { World } from "./world";
import type { Random } from "./random";

export abstract class GameObject implements Moveable, Updateable {
  parent: GameObject | null = null;
  position: Vector;
  targetVelocity: number;
  velocity: number;
  rotation: number;
  targetAngularVelocity: number;
  angularVelocity: number;
  world: World | null = null;
  lifeTime: number = 0;
  random: Random;

  abstract health: number;
  abstract maxHealth: number;

  private static lastId: number = 0;
  id: number = GameObject.lastId++;
  get name(): string {
    return this.constructor.name + "_" + this.id;
  }

  radius: number = 0;
  checkCollisions: boolean = true;

  element!: SVGElement;

  constructor(random: Random, pos: Vector, angle: number, radius: number) {
    this.random = random;
    this.position = pos;
    this.targetVelocity = 0;
    this.velocity = 0;
    this.rotation = angle;
    this.targetAngularVelocity = 0;
    this.angularVelocity = 0;
    this.radius = radius;
  }

  collide(collision: GameObject, _isSelf: boolean): void {
    this.damage(collision);
  }

  damage(collision: GameObject): void {
    if (!this.shouldTakeDamage(collision)) return;

    this.health--;

    if (this.health <= 0) {
      this.destroy(collision);
    }
  }

  destroy(_reason: GameObject): void {
    this.world?.removeObject(this);
  }

  abstract shouldTakeDamage(collision: GameObject): boolean;

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    this.element = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.element.setAttribute(
      "transform",
      `translate(${this.position.x}, ${this.position.y}) rotate(${this.rotation})`
    );

    if (localStorage.getItem("debug") === "true") {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", `${this.radius}`);
      circle.setAttribute("stroke", "red");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke-width", "1");
      this.element.appendChild(circle);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "0");
      line.setAttribute("y1", "0");
      line.setAttribute("x2", "0");
      line.setAttribute("y2", `${-this.radius}`);
      line.setAttribute("stroke", "green");
      line.setAttribute("stroke-width", "2");
      this.element.appendChild(line);
    }

    return this.element;
  }

  updateElement(): void {
    this.element.setAttribute(
      "transform",
      `translate(${this.position.x}, ${this.position.y}) rotate(${this.rotation})`
    );
  }

  update(deltaTime: number): void {
    this.lifeTime += deltaTime;
    this.velocity = Utils.lerp(this.velocity, this.targetVelocity, 0.02);
    this.angularVelocity = Utils.lerp(this.angularVelocity, this.targetAngularVelocity, 0.05);
    this.position.x += Math.sin((this.rotation * Math.PI) / 180) * this.velocity * deltaTime;
    this.position.y -= Math.cos((this.rotation * Math.PI) / 180) * this.velocity * deltaTime;
    this.rotation += this.angularVelocity * deltaTime;

    // clamp rotation to [-180,180]
    if (this.rotation < -180) {
      this.rotation += 360;
    } else if (this.rotation > 180) {
      this.rotation -= 360;
    }

    // check collisions with other game objects
    if (!this.checkCollisions) return;
    for (const gameObject of this.world?.getObjects() || []) {
      if (gameObject !== this && this.isColliding(gameObject)) {
        gameObject.collide(this, false);
        this.collide(gameObject, true);

        break;
      }
    }
  }

  isColliding(other: GameObject): boolean {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const distanceSquared = dx * dx + dy * dy;
    const radiusSum = this.radius + other.radius;
    return distanceSquared < radiusSum * radiusSum;
  }
}
