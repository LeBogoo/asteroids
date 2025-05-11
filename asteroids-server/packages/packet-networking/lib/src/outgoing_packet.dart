import 'dart:mirrors';

abstract class OutgoingPacket {
  Map<String, dynamic> toJson() {
    return {
      "type": "${namespace}_$type",
    };
  }

  String stringify();
}

extension OutgoingPacketExtension on OutgoingPacket {
  String get type {
    return reflectClass(runtimeType).metadata.first.reflectee.type;
  }

  String get namespace {
    return reflectClass(runtimeType).metadata.first.reflectee.namespace;
  }
}
