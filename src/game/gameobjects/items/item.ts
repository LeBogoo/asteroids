import type { Random } from "../../random";
import type { Vector } from "../../vector";
import { DespawnableGameObject } from "../despawnable-game-object";
import { GameObject } from "../gameobject";

export abstract class Item extends DespawnableGameObject {
  despawnTime: number = 10;
  health: number = 0;
  maxHealth: number = 0;

  constructor(random: Random, pos: Vector) {
    super(random, pos, 0, 20);
  }

  shouldTakeDamage(_collision: GameObject): boolean {
    return false;
  }

  checkCollisions: boolean = false;

  abstract consume(consumer: GameObject): void;
}
