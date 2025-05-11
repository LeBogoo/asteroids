import 'dart:math';

import './bullet.dart';
import './face.dart';
import './fragment.dart';
import './gameobject.dart';
import './utils.dart';
import './vector.dart';

const EXPLODE_FORCE = 1;

class Asteroid extends GameObject {
  Vector _customVelocity;
  List<Vector> points = _generateAsteroidPoints();

  Asteroid(Vector pos, double angle, double radius)
      : _customVelocity = Utils.getVectorFromAngle(angle, 5),
        super(pos, angle, radius);

  void explode(Bullet bullet) {
    Vector midPoint = Vector(0, 0);

    // Apply rotation to points
    var rotatedPoints = points.map((Vector point) {
      var cosVal = cos(rotation * (pi / 180));
      var sinVal = sin(rotation * (pi / 180));
      return Vector(
        point.x * cosVal - point.y * sinVal,
        point.x * sinVal + point.y * cosVal,
      );
    });

    for (var i = 0; i < rotatedPoints.length; i++) {
      var point = rotatedPoints.elementAt(i);
      var nextPoint = rotatedPoints.elementAt((i + 1) % rotatedPoints.length);
      Face face = Face(point, nextPoint, midPoint);

      face = face.offset();

      Vector pos = Vector(
        position.x + face.center.x,
        position.y + face.center.y,
      );
      double fragmentSpeed = Random().nextDouble() * 0.5 + 0.5;
      Vector fragmentDirection = Utils.getVectorFromAngle(
          bullet.rotation, bullet.velocity * fragmentSpeed * 0.2);

      Vector fragmentVelocity = Vector(
        fragmentDirection.x + face.center.x * EXPLODE_FORCE,
        fragmentDirection.y + face.center.y * EXPLODE_FORCE,
      );

      Fragment fragment =
          Fragment(pos, this.radius / 2, face, fragmentVelocity);

      world?.addObject(fragment);
    }

    world?.removeObject(this);
  }

  void update(double deltaTime) {
    angularVelocity =
        Utils.lerp(this.angularVelocity, this.targetAngularVelocity, 0.05);
    position.x += _customVelocity.x * deltaTime;
    position.y += _customVelocity.y * deltaTime;
    rotation += this.angularVelocity * deltaTime;
  }

  static List<Vector> _generateAsteroidPoints() {
    int numPoints = Random().nextInt(3) * 2 + 6;
    List<Vector> points = [];
    for (int i = 0; i < numPoints; i++) {
      double angle = (i / numPoints) * pi * 2;
      double distance = 0.7 + Random().nextDouble() * 0.6;
      double x = cos(angle) * distance;
      double y = sin(angle) * distance;
      points.add(Vector(x, y));
    }

    return points;
  }
}
