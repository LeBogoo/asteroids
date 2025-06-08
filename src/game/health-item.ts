import type { GameObject } from "./gameobject";
import { Item } from "./item";
import { Spaceship } from "./spaceship";
import { Vector } from "./vector";

export class HealthItem extends Item {
  healthGain = 2;

  consume(consumer: GameObject): void {
    consumer.health += this.healthGain;
    consumer.health = Math.min(consumer.health, consumer.maxHealth);
    this.destroy(consumer);
  }

  collide(collision: GameObject, isSelf: boolean): void {
    super.collide(collision, isSelf);
    if (isSelf) return;
    if (collision instanceof Spaceship) {
      this.consume(collision);
    }
  }

  getElement(): SVGElement {
    if (this.element) {
      return this.element;
    }

    let element = super.getElement();

    const packet = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const hullPointCoords = [
      Vector.fromAngle(0 + 45, this.radius * 1.2),
      Vector.fromAngle(90 + 45, this.radius * 1.2),
      Vector.fromAngle(180 + 45, this.radius * 1.2),
      Vector.fromAngle(-90 + 45, this.radius * 1.2),
    ];
    const hullPoints = hullPointCoords.map((point) => `${point.x},${point.y}`).join(" ");
    packet.setAttribute("points", hullPoints);
    packet.setAttribute("stroke", "lime");
    packet.setAttribute("stroke-width", "1");
    packet.setAttribute("fill", "none");
    element.appendChild(packet);

    const plus = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    const plusPointCoords = [
      Vector.fromAngle(0, this.radius * 0.4),
      Vector.zero(),
      Vector.fromAngle(90, this.radius * 0.4),
      Vector.zero(),
      Vector.fromAngle(180, this.radius * 0.4),
      Vector.zero(),
      Vector.fromAngle(-90, this.radius * 0.4),
      Vector.zero(),
    ];
    const plusPoints = plusPointCoords.map((point) => `${point.x},${point.y}`).join(" ");
    plus.setAttribute("points", plusPoints);
    plus.setAttribute("stroke", "lime");
    plus.setAttribute("stroke-width", "1");
    plus.setAttribute("fill", "none");
    element.appendChild(plus);

    return element;
  }
}
