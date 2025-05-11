import 'dart:mirrors';

abstract class IncomingPacket {
  String stringify();
}

@override
extension IncomingPacketExtension on IncomingPacket {
  String get type {
    return reflectClass(runtimeType).metadata.first.reflectee.type;
  }

  String get namespace {
    return reflectClass(runtimeType).metadata.first.reflectee.namespace;
  }
}
