import '../gameobject.dart';

abstract class Collidable {
  bool isColliding(GameObject other);
}
