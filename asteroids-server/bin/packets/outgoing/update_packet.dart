import 'package:packet_networking/packet_networking.dart';

import '../../game/gameobject.dart';

class UpdatePacket extends OutgoingPacket {
  @override
  String type = "update";

  GameObject object = GameObject.empty();

  UpdatePacket({
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
    return "UpdatePacket{object: $object}";
  }
}
