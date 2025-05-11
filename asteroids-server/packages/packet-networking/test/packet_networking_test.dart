import 'package:packet_networking/packet_networking.dart';
import 'package:test/test.dart';

void main() {
  PacketRegistry registry = PacketRegistry.instance;

  test('if ping packet can be successfully serialized', () {
    PingPacket packet = PingPacket(timestamp: 42);
    Map<String, dynamic> json = packet.toJson();

    print(json);

    expect(json["type"], "generic_ping");
    expect(json["timestamp"], 42);
  });

  test('if registry can sucessfully parse an incoming pong packet', () {
    Map<String, dynamic> json = {"type": "generic_pong", "timestamp": 42};

    expect(registry.fromJson(json) is PongPacket, true);
  });

  test('if invalid incoming packet throws an error', () {
    Map<String, dynamic> json = {"type": "invalid_packet_90312893012"};

    try {
      registry.fromJson(json);

      fail("Should have thrown an error");
    } catch (e) {
      expect(e is PacketNotFoundException, true);
    }
  });
}
