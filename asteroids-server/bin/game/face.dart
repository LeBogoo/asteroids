import 'vector.dart';

class Face {
  Vector a;
  Vector b;
  Vector c;

  Face(this.a, this.b, this.c);

  @override
  String toString() {
    return 'Face(a: $a, b: $b, c: $c)';
  }

  Face offset() {
    return Face(
      Vector(a.x - center.x, a.y - center.y),
      Vector(b.x - center.x, b.y - center.y),
      Vector(c.x - center.x, c.y - center.y),
    );
  }

  Vector get center {
    return Vector(
      (a.x + b.x + c.x) / 3,
      (a.y + b.y + c.y) / 3,
    );
  }
}
