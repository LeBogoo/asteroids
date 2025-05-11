import 'dart:math';

import './gameobject.dart';
import './utils.dart';
import './vector.dart';
import 'face.dart';

class Fragment extends GameObject {
  Vector _customVelocity;
  Face face;
  double deathTime;

  Fragment(Vector pos, double radius, Face face, Vector velocity)
      : _customVelocity = velocity,
        face = face,
        deathTime = 5 + Random().nextDouble() * 10,
        super(pos, 0, radius);

  void update(double deltaTime) {
    lifeTime += deltaTime;
    angularVelocity = Utils.lerp(angularVelocity, targetAngularVelocity, 0.05);
    position.x += _customVelocity.x * deltaTime;
    position.y += _customVelocity.y * deltaTime;
    rotation += angularVelocity * deltaTime;

    if (lifeTime > deathTime) {
      world?.removeObject(this);
    }
  }
}
