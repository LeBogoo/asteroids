import { Bullet } from "./bullet";
import { GameObject } from "./gameobject";
import { Vector } from "./vector";
import { SoundManager } from "./soundmanger";
import { Asteroid } from "./asteroid";
import { Fragment } from "./fragment";

const SHOOT_COOLDOWN = 50;

export class Spaceship extends GameObject {
  lastShot: number = 0;
  private isThrusting: boolean = false;
  private flame!: SVGElement;
  private _isPlayer: boolean;
  private isDestroyed: boolean = false;

  fragmentsDestroyed: number = 0;

  forward = 0;
  turn = 0;

  get isPlayer(): boolean {
    return this._isPlayer;
  }

  health: number = 20;
  maxHealth: number = 20;

  constructor(isPlayer: boolean, pos: Vector, angle: number) {
    super(pos, angle, 15);
    this._isPlayer = isPlayer;
  }

  shoot(): void {
    if (this.isDestroyed || !this.world) {
      return;
    }

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
    SoundManager.playSound("shoot", 0.25);
  }

  reset(): void {
    this.health = 100;
    this.isDestroyed = false;
    this.fragmentsDestroyed = 0;
  }

  destroy(_reason: GameObject): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    this.stopThrusting();
    this.turn = 0;
    this.forward = 0;
    this.targetVelocity = 0;
    this.targetAngularVelocity = 0;
  }

  startThrusting(): void {
    if (this.isThrusting || this.isDestroyed) return;
    SoundManager.playFilteredNoise();
    this.isThrusting = true;
  }
  private stopThrusting(): void {
    if (!this.isThrusting) return;
    SoundManager.stopNoise();
    this.isThrusting = false;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    if (this.isDestroyed) {
      return;
    }

    this.targetVelocity = this.forward * 300;
    this.targetAngularVelocity = this.turn * 200;

    if (this.targetVelocity != 0 && !this.isThrusting) {
      this.startThrusting();
    }

    if (this.targetVelocity == 0 && this.isThrusting) {
      this.stopThrusting();
    }
  }

  shouldTakeDamage(collision: GameObject): boolean {
    if (this.isDestroyed || collision.parent == this) return false;

    return collision instanceof Asteroid || collision instanceof Fragment || collision instanceof Bullet;
  }

  updateElement(): void {
    super.updateElement();

    this.flame.setAttribute("opacity", this.isThrusting ? "1" : "0");
    this.flame.setAttribute("transform", `translate(0, ${this.radius * 0.5}) rotate(${-this.angularVelocity / 10})`);
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();

    this.flame = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const redFire = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const redFirePoints = [
      Vector.fromAngle(180, this.radius * 1.5).add(Vector.fromAngle(0, this.radius * 0.5)),
      Vector.fromAngle(160, this.radius * 0.7).add(Vector.fromAngle(0, this.radius * 0.5)),
      Vector.fromAngle(180, this.radius * 0.5).add(Vector.fromAngle(0, this.radius * 0.5)),
      Vector.fromAngle(-160, this.radius * 0.7).add(Vector.fromAngle(0, this.radius * 0.5)),
    ];
    const redFirePointsString = redFirePoints.map((point) => `${point.x},${point.y}`).join(" ");
    redFire.setAttribute("points", redFirePointsString);
    redFire.setAttribute("stroke", "red");
    redFire.setAttribute("stroke-width", "1");

    const yellowFire = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const yellowFirePoints = [
      Vector.fromAngle(180, this.radius * 1.1).add(Vector.fromAngle(0, this.radius * 0.5)),
      Vector.fromAngle(170, this.radius * 0.7).add(Vector.fromAngle(0, this.radius * 0.5)),
      Vector.fromAngle(180, this.radius * 0.5).add(Vector.fromAngle(0, this.radius * 0.5)),
      Vector.fromAngle(-170, this.radius * 0.7).add(Vector.fromAngle(0, this.radius * 0.5)),
    ];
    const yellowFirePointsString = yellowFirePoints.map((point) => `${point.x},${point.y}`).join(" ");
    yellowFire.setAttribute("points", yellowFirePointsString);
    yellowFire.setAttribute("stroke", "yellow");
    yellowFire.setAttribute("stroke-width", "1");

    this.flame.appendChild(redFire);
    this.flame.appendChild(yellowFire);

    element.appendChild(this.flame);

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
      const soundBarrier = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      soundBarrier.setAttribute("r", "700");
      soundBarrier.setAttribute("stroke", "cyan");
      soundBarrier.setAttribute("fill", "none");
      soundBarrier.setAttribute("stroke-width", "1");
      element.appendChild(soundBarrier);

      const spawnDistance = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      spawnDistance.setAttribute("r", "1500");
      spawnDistance.setAttribute("stroke", "cyan");
      spawnDistance.setAttribute("fill", "none");
      spawnDistance.setAttribute("stroke-width", "1");
      element.appendChild(spawnDistance);
    }

    return element;
  }
}
