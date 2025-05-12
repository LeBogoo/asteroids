import 'package:packet_networking/packet_networking.dart';

class PongPacket extends IncomingPacket {
  @override
  String type = "pong";

  int timestamp = 0;

  PongPacket.empty();

  PongPacket({
    required this.timestamp,
  });

  factory PongPacket.fromJson(Map<String, dynamic> json) {
    return PongPacket(
      timestamp: json["timestamp"],
    );
  }

  @override
  String stringify() {
    return "PongPacket{timestamp: $timestamp}";
  }
}
