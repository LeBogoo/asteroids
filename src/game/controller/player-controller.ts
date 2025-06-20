import type { Controller } from "../interfaces/controller";
import type { Spaceship } from "../gameobjects/spaceship";

export class PlayerController implements Controller {
  spaceship: Spaceship;
  constructor(spaceship: Spaceship) {
    this.spaceship = spaceship;

    window.addEventListener("keydown", (event) => {
      if (event.repeat) return;

      const key = event.key.toLowerCase();
      console.log(key);

      if (key == " ") spaceship.shoot();
      if (key == "w") spaceship.forward = 1;
      if (key == "s") spaceship.forward = -1;
      if (key == "a") spaceship.turn = -1;
      if (key == "d") spaceship.turn = 1;
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();

      if (key == "w") spaceship.forward = 0;
      if (key == "s") spaceship.forward = 0;
      if (key == "a") spaceship.turn = 0;
      if (key == "d") spaceship.turn = 0;
    });
  }

  update(_deltaTime: number): void {}
}
