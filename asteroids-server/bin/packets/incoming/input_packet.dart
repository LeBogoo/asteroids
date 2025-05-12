import 'package:packet_networking/packet_networking.dart';

class InputPacket extends IncomingPacket {
  @override
  String type = "input";

  int x = 0;
  int y = 0;
  bool shoot = false;

  InputPacket.empty();

  InputPacket({
    required this.x,
    required this.y,
    this.shoot = false,
  });

  factory InputPacket.fromJson(Map<String, dynamic> json) {
    return InputPacket(
      x: json["x"],
      y: json["y"],
      shoot: json["shoot"] ?? false,
    );
  }

  @override
  String stringify() {
    return "InputPacket{x: $x, y: $y, shoot: $shoot}";
  }
}
