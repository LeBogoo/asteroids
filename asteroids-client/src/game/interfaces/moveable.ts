import type { Vector } from "./vector";

export interface Moveable {
  position: Vector;
  targetVelocity: number;
  velocity: number;
  rotation: number;
  targetAngularVelocity: number;
  angularVelocity: number;
}
