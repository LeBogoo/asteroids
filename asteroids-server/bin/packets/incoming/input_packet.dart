import 'package:packet_networking/packet_networking.dart';

class InputPacket extends IncomingPacket {
  @override
  String type = "input";

  double x = 0;
  double y = 0;
  bool shoot = false;

  InputPacket.empty();

  InputPacket({
    required this.x,
    required this.y,
    this.shoot = false,
  });

  factory InputPacket.fromJson(Map<String, dynamic> json) {
    print(json);

    return InputPacket(
      x: double.parse(json["x"].toString()),
      y: double.parse(json["y"].toString()),
      shoot: json["shoot"] ?? false,
    );
  }

  @override
  String stringify() {
    return "InputPacket{x: $x, y: $y, shoot: $shoot}";
  }
}
