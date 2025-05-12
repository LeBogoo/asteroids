import 'package:packet_networking/packet_networking.dart';

class DestroyPacket extends OutgoingPacket {
  @override
  String type = "destroy";

  String id = "";

  DestroyPacket({
    required this.id,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      "id": id,
    };
  }

  @override
  String stringify() {
    return "DestroyPacket{id: $id}";
  }
}
