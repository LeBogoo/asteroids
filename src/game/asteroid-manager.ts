import { Asteroid } from "./gameobjects/asteroid";
import { Vector } from "./vector";
import type { World } from "./world";
import type { Updateable } from "./interfaces/updateable";
import type { Spaceship } from "./gameobjects/spaceship";
import { Random } from "./random";

export class AsteroidManager implements Updateable {
  private random: Random;
  private world: World;
  private player: Spaceship;
  private spawnDistance: number = 1500;
  private despawnDistance: number = 2000;
  private spawnTimer: number = 0;
  private spawnInterval: number = 500; // ms
  private coneAngle: number = 90; // degrees, total cone width
  private minPlayerSpeed: number = 50; // minimum speed to trigger spawning

  constructor(random: Random, world: World, player: Spaceship) {
    this.random = random;
    this.world = world;
    this.player = player;
  }

  update(deltaTime: number): void {
    this.spawnTimer += deltaTime * 1000;

    // Only spawn if player is moving fast enough
    if (this.player.velocity > this.minPlayerSpeed && this.spawnTimer >= this.spawnInterval) {
      this.spawnAsteroidInCone();
      this.spawnTimer = 0;
    }

    this.despawnDistantAsteroids();
  }

  private spawnAsteroidInCone(): void {
    // Use player's rotation as the cone center direction
    const playerDirection = this.player.rotation;

    // Random angle within the cone (±coneAngle/2 from player direction)
    const angleOffset = (this.random.next() - 0.5) * this.coneAngle;
    const spawnAngle = playerDirection + angleOffset;

    const distance = this.spawnDistance + this.random.next() * 200;

    const spawnPos = new Vector(
      this.player.position.x + Math.sin((spawnAngle * Math.PI) / 180) * distance,
      this.player.position.y - Math.cos((spawnAngle * Math.PI) / 180) * distance
    );

    const asteroidAngle = this.random.next() * 360;
    const asteroidSize = 20 + this.random.next() * 40;

    const asteroid = new Asteroid(this.random, spawnPos, asteroidAngle, asteroidSize);
    asteroid.targetAngularVelocity = (this.random.next() - 0.5) * 100;

    this.world.addObject(asteroid);
  }

  private despawnDistantAsteroids(): void {
    const asteroids = this.world.getObjects().filter((obj) => obj instanceof Asteroid) as Asteroid[];

    asteroids.forEach((asteroid) => {
      const distance = asteroid.position.distanceTo(this.player.position);
      if (distance > this.despawnDistance) {
        this.world.removeObject(asteroid);
      }
    });
  }
}
