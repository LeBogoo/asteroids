import 'dart:math';

class Vector {
  double x;
  double y;

  Vector(this.x, this.y);

  @override
  String toString() {
    return 'Vector(x: $x, y: $y)';
  }

  Vector operator +(Vector other) {
    return Vector(x + other.x, y + other.y);
  }

  Vector operator -(Vector other) {
    return Vector(x - other.x, y - other.y);
  }

  Vector operator *(double scalar) {
    return Vector(x * scalar, y * scalar);
  }

  Vector operator /(double scalar) {
    return Vector(x / scalar, y / scalar);
  }

  double distanceTo(Vector other) {
    return sqrt(pow(x - other.x, 2) + pow(y - other.y, 2));
  }

  Map<String, dynamic> toJson() {
    return {
      'x': x,
      'y': y,
    };
  }
}
