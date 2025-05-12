import 'dart:math';
import 'package:uuid/uuid.dart';

import 'interfaces/collidable.dart';
import 'interfaces/moveable.dart';
import 'interfaces/updateable.dart';
import 'utils.dart';
import 'vector.dart';
import 'world.dart';

class EmptyGameObject extends GameObject {
  @override
  String type = "empty";

  EmptyGameObject() : super(Vector(0, 0), 0, 2);
}

abstract class GameObject implements Moveable, Updateable, Collidable {
  String get type;

  @override
  Vector position;

  @override
  double targetVelocity = 0;

  @override
  double velocity = 0;

  @override
  double rotation;

  @override
  double targetAngularVelocity = 0;

  @override
  double angularVelocity = 0;

  World? world;

  final String id = Uuid().v4();

  double lifeTime = 0.0;
  double radius = 0.0;

  static GameObject empty() {
    return EmptyGameObject();
  }

  GameObject(this.position, this.rotation, this.radius);

  @override
  void update(double deltaTime) {
    lifeTime += deltaTime;
    velocity = Utils.lerp(velocity, targetVelocity, 0.02);
    angularVelocity = Utils.lerp(angularVelocity, targetAngularVelocity, 0.05);
    position.x += sin((rotation * pi) / 180) * velocity * deltaTime;
    position.y -= cos((rotation * pi) / 180) * velocity * deltaTime;
    rotation += angularVelocity * deltaTime;
  }

  bool isColliding(GameObject other) {
    var dx = position.x - other.position.x;
    var dy = position.y - other.position.y;
    var distanceSquared = dx * dx + dy * dy;
    var radiusSum = radius + other.radius;
    return distanceSquared < radiusSum * radiusSum;
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "type": type,
      "position": position.toJson(),
      "rotation": rotation,
      "velocity": velocity,
      "angularVelocity": angularVelocity,
      "radius": radius,
    };
  }
}
