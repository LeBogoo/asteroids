import { Bullet } from "./bullet";
import { GameObject } from "./gameobject";
import { Vector } from "./vector";
import { SoundManager } from "./soundmanger";

const SHOOT_COOLDOWN = 50;

export class Spaceship extends GameObject {
  lastShot: number = 0;
  private isThrusting: boolean = false;

  constructor(pos: Vector, angle: number) {
    super(pos, angle, 15);
  }

  shoot(): void {
    if (Date.now() - this.lastShot < SHOOT_COOLDOWN) {
      return;
    }
    this.lastShot = Date.now();
    const pos = Vector.fromAngle(this.rotation, this.radius);
    pos.x += this.position.x;
    pos.y += this.position.y;
    const bullet = new Bullet(pos, this.rotation);
    bullet.parent = this;
    bullet.world = this.world;
    this.world?.addObject(bullet);
    SoundManager.playSound("shoot");
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.targetVelocity != 0 && !this.isThrusting) {
      SoundManager.playFilteredNoise();
      this.isThrusting = true;
    }

    if (this.targetVelocity == 0 && this.isThrusting) {
      SoundManager.stopNoise();
      this.isThrusting = false;
    }
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();
    const hull = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const hullPoints = [
      Vector.fromAngle(0, this.radius),
      Vector.fromAngle(140, this.radius),
      Vector.fromAngle(180, this.radius * 0.5),
      Vector.fromAngle(-140, this.radius),
    ];
    const points = hullPoints.map((point) => `${point.x},${point.y}`).join(" ");
    hull.setAttribute("points", points);

    hull.setAttribute("stroke", "white");
    hull.setAttribute("stroke-width", "1");

    element.appendChild(hull);

    if (localStorage.getItem("debug") === "true") {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "700");
      circle.setAttribute("stroke", "cyan");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke-width", "1");
      element.appendChild(circle);
    }

    return element;
  }
}
