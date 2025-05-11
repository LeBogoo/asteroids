import 'dart:math';

import './vector.dart';

class Utils {
  /**
   * Linearly interpolate between two doubles (start and end) by a factor t
   */
  static double lerp(double start, double end, double t) {
    return start + (end - start) * t;
  }

  /**
 * Calculate the point at the given angle of a circle with the given distance
 */
  static Vector getVectorFromAngle(double angle, double distance) {
    double angleInRadians = ((angle - 90) * 3.141592653589793) / 180;

    double x = distance * cos(angleInRadians);
    double y = distance * sin(angleInRadians);
    return Vector(x, y);
  }
}
