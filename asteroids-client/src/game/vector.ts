export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Vector): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }

  static zero = () => new Vector(0, 0);

  static fromAngle(angle: number, distance: number): Vector {
    const angleInRadians = ((angle - 90) * Math.PI) / 180;

    const x = distance * Math.cos(angleInRadians);
    const y = distance * Math.sin(angleInRadians);
    return new Vector(x, y);
  }
}
