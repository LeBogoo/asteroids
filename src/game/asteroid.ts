import { Fragment } from "./fragment";
import { GameObject } from "./gameobject";
import type { Face } from "./interfaces/face";
import { Vector } from "./vector";
import { SoundManager } from "./soundmanger";
import * as Utils from "./utils";
import { Bullet } from "./bullet";
import { Spaceship } from "./spaceship";

const EXPLODE_FORCE = 1;

export class Asteroid extends GameObject {
  customVelocity: Vector;
  points: Vector[] = [];
  health: number = 1;

  constructor(pos: Vector, angle: number, radius: number) {
    super(pos, angle, radius);
    this.customVelocity = Vector.fromAngle(angle, 5);
  }

  destroy(projectile: GameObject): void {
    const midPoint = Vector.zero();

    // Apply rotation to points
    const rotatedPoints = this.points.map((point) => {
      const cos = Math.cos(this.rotation * (Math.PI / 180));
      const sin = Math.sin(this.rotation * (Math.PI / 180));
      return new Vector(point.x * cos - point.y * sin, point.x * sin + point.y * cos);
    });

    for (let i = 0; i < rotatedPoints.length; i++) {
      const point = rotatedPoints[i];
      const nextPoint = rotatedPoints[i + 1] || rotatedPoints[0];
      let face: Face = [point, nextPoint, midPoint];

      const centerX = (face[0].x + face[1].x + face[2].x) / 3;
      const centerY = (face[0].y + face[1].y + face[2].y) / 3;

      // offset the face points by the center point
      face = face.map((p) => ({
        x: p.x - centerX,
        y: p.y - centerY,
      })) as Face;

      // { x: this.position.x + centerX, y: this.position.y + centerY };
      const pos = new Vector(this.position.x + centerX, this.position.y + centerY);
      const fragmentSpeed = Math.random() * 0.5 + 0.5;
      const fragmentDirection = Vector.fromAngle(projectile.rotation, projectile.velocity * fragmentSpeed * 0.2);

      let fragmentVelocity = new Vector(
        fragmentDirection.x + this.customVelocity.x * EXPLODE_FORCE,
        fragmentDirection.y + this.customVelocity.y * EXPLODE_FORCE
      );

      let fragment = new Fragment(pos, this.radius / 2, face, fragmentVelocity);

      this.world?.addObject(fragment);
    }

    SoundManager.playSoundAt("explode_big", this.position);
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

    // Create the asteroid shape as a polygon
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    this.points = this.generateAsteroidPoints();
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

  private generateAsteroidPoints(): Vector[] {
    const numPoints = Math.floor(Math.random() * 3) * 2 + 6;
    const points: Vector[] = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const distance = this.radius * (0.7 + Math.random() * 0.6);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      points.push(new Vector(x, y));
    }
    return points;
  }
}
