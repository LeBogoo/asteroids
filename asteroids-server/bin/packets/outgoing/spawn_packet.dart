import 'package:packet_networking/packet_networking.dart';

import '../../game/gameobject.dart';

class SpawnPacket extends OutgoingPacket {
  @override
  String type = "spawn";

  GameObject object = GameObject.empty();

  SpawnPacket({
    required this.object,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      "object": object,
    };
  }

  @override
  String stringify() {
    return "SpawnPacket{object: $object}";
  }
}
