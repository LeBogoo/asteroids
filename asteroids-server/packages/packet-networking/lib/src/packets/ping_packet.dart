import 'package:packet_networking/packet_networking.dart';

@Packet("ping", PacketRegistry.genericNamespace)
class PingPacket extends OutgoingPacket {
  final int timestamp;

  PingPacket({
    required this.timestamp,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      "timestamp": timestamp,
    };
  }

  @override
  String stringify() {
    return "PingPacket{timestamp: $timestamp}";
  }
}
