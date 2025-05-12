import 'dart:math';

import 'package:packet_networking/packet_networking.dart';

import '../packets/incoming/input_packet.dart';
import '../packets/outgoing/update_packet.dart';
import '../packets/outgoing/you_packet.dart';
import './spaceship.dart';
import './vector.dart';
import './world.dart';

class Player {
  String username;
  World world;

  Spaceship ship = Spaceship(Vector(0, 0), 0);
  String get id => ship.id;

  Connection connection;

  Player({
    required this.username,
    required this.world,
    required this.connection,
  }) {
    connection.send(YouPacket(id: id));

    ship.world = world;
    world.addPlayer(this);

    connection.on<InputPacket>((packet) {
      ship.targetVelocity = packet.y * 300;
      ship.targetAngularVelocity = packet.x * 300;

      world.broadcast(UpdatePacket(object: ship));
    });

    connection.on<DisconnectEvent>((event) {
      world.removePlayer(this);
    });
  }
}
