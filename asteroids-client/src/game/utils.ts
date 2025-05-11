import type { Vector } from "./interfaces/vector";

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function lerpVector(start: Vector, end: Vector, t: number): Vector {
  return {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t,
  };
}

/**
 * Calculate the point at the given angle of a circle with the given distance
 * @param angle Angle in degrees
 * @param distance Distance from the center of the circle
 * @returns The point at the given angle
 */
export function getVectorFromAngle(angle: number, distance: number): Vector {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  const x = distance * Math.cos(angleInRadians);
  const y = distance * Math.sin(angleInRadians);
  return { x, y };
}
