import '../vector.dart';

abstract class Moveable {
  Vector position;
  double targetVelocity;
  double velocity;
  double rotation;
  double targetAngularVelocity;
  double angularVelocity;

  Moveable({
    required this.position,
    required this.targetVelocity,
    required this.velocity,
    required this.rotation,
    required this.targetAngularVelocity,
    required this.angularVelocity,
  });
}
