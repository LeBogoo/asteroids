import "dart:mirrors";
import 'package:packet_networking/packet_networking.dart';

typedef PacketFactory = IncomingPacket Function(Map<String, dynamic> json);

class PacketRegistry {
  static final PacketRegistry instance = PacketRegistry._();
  static const String genericNamespace = "generic";
  final Map<String, PacketFactory> _registry = {};

  PacketRegistry._() {
    _registerPackets();
  }

  void _registerPackets() {
    for (LibraryMirror library in currentMirrorSystem().libraries.values) {
      for (DeclarationMirror declaration in library.declarations.values) {
        if (declaration is ClassMirror && declaration.metadata.isNotEmpty) {
          for (var metadata in declaration.metadata) {
            if (metadata.reflectee is Packet) {
              final packet = metadata.reflectee as Packet;
              final classMirror = declaration;
              if (!classMirror.superinterfaces
                  .contains(reflectType(IncomingPacket))) {
                continue;
              }

              _registry["${packet.namespace}_${packet.type}"] = (json) {
                return classMirror.newInstance(#fromJson, [json]).reflectee
                    as IncomingPacket;
              };
            }
          }
        }
      }
    }
  }

  IncomingPacket fromJson(Map<String, dynamic> json) {
    final factory = _registry[json["type"]];
    if (factory == null) {
      throw PacketNotFoundException(json["type"]);
    }

    return factory(json);
  }
}
