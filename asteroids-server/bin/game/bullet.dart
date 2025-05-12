import './asteroid.dart';
import './fragment.dart';
import './gameobject.dart';
import './vector.dart';

class Bullet extends GameObject {
  String get type => "bullet";

  static const double BULLET_SPEED = 500;
  static const double MAX_BULLET_LIFETIME = 1000 * 2;
  DateTime spawnTime = DateTime.now();

  Bullet(Vector pos, double angle) : super(pos, angle, 2) {
    targetVelocity = BULLET_SPEED;
    velocity = BULLET_SPEED;
  }

  void update(double deltaTime) {
    super.update(deltaTime);
    if (DateTime.now().millisecondsSinceEpoch -
            spawnTime.millisecondsSinceEpoch >
        MAX_BULLET_LIFETIME) {
      this.world?.removeObject(this);
    }

    // Check for collision with other game objects
    if (world == null) return;
    for (var gameObject in world!.gameObjects) {
      if (gameObject != this && isColliding(gameObject)) {
        if (gameObject is Asteroid) {
          gameObject.explode(this);
        }

        if (gameObject is Fragment) {
          world?.removeObject(gameObject);
        }

        world?.removeObject(this);
        break;
      }
    }
  }
}
