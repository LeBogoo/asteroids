import 'package:packet_networking/packet_networking.dart';

@Packet("pong", PacketRegistry.genericNamespace)
class PongPacket implements IncomingPacket {
  final int timestamp;

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
