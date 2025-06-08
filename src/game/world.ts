import type { GameObject } from "./gameobject";
import type { Updateable } from "./interfaces/updateable";

export class World implements Updateable {
  private gameObjects: GameObject[] = [];

  addObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
    this.onAdd(gameObject);
    gameObject.world = this;
  }

  removeObject(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);
    if (index !== -1) {
      this.gameObjects.splice(index, 1);
      gameObject.world = null;
      this.onRemove(gameObject);
    }
  }

  onAdd(_gameObject: GameObject) {}
  onRemove(_gameObject: GameObject) {}

  update(deltaTime: number): void {
    for (const gameObject of this.gameObjects) {
      gameObject.update(deltaTime);
    }
  }

  getObjects(): GameObject[] {
    return this.gameObjects;
  }
}
