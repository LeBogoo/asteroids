import './bullet.dart';
import './gameobject.dart';
import './utils.dart';
import './vector.dart';

const SHOOT_COOLDOWN = 250;

class Spaceship extends GameObject {
  String get type => "spaceship";

  DateTime lastShot = DateTime.fromMillisecondsSinceEpoch(0);

  Spaceship(Vector pos, double angle) : super(pos, angle, 15);

  void shoot() {
    DateTime now = DateTime.now();
    int diff = now.millisecondsSinceEpoch - lastShot.millisecondsSinceEpoch;

    if (diff < SHOOT_COOLDOWN) {
      return;
    }
    lastShot = DateTime.now();

    Vector pos = Utils.getVectorFromAngle(this.rotation, this.radius);
    pos.x += this.position.x;
    pos.y += this.position.y;

    Bullet bullet = Bullet(pos, this.rotation);
    bullet.world = this.world;

    this.world?.addObject(bullet);
  }
}
