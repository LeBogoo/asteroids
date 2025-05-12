import 'package:packet_networking/packet_networking.dart';

typedef PacketFactory = IncomingPacket Function(Map<String, dynamic> json);

class PacketRegistry {
  static final Map<String, PacketFactory> _registry = {};

  static void registerPacket(IncomingPacket packet, PacketFactory factory) {
    _registry[packet.type] = factory;
    print("[PacketRegistry] Registered packet type: ${packet.type}");
  }

  static IncomingPacket fromJson(Map<String, dynamic> json) {
    final factory = _registry[json["type"]];
    if (factory == null) {
      throw PacketNotFoundException(json["type"]);
    }

    return factory(json);
  }
}
