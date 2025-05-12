import 'package:packet_networking/packet_networking.dart';

import '../packets/outgoing/destroy_packet.dart';
import '../packets/outgoing/joined_game_packet.dart';
import '../packets/outgoing/left_game_packet.dart';
import '../packets/outgoing/spawn_packet.dart';
import './gameobject.dart';
import './interfaces/updateable.dart';
import './player.dart';

class World implements Updateable {
  List<Player> players = [];

  Map<String, GameObject> _gameObjects = {};

  List<GameObject> get gameObjects => _gameObjects.values.toList();

  void addPlayer(Player player) {
    for (var gameObject in gameObjects) {
      player.connection.send(SpawnPacket(
        object: gameObject,
      ));
    }

    for (var p in players) {
      player.connection.send(JoinedGamePacket(
        username: p.username,
        id: p.id,
      ));
    }

    players.add(player);
    addObject(player.ship);

    broadcast(JoinedGamePacket(username: player.username, id: player.id));
  }

  void removePlayer(Player player) {
    players.remove(player);
    removeObject(player.ship);

    broadcast(LeftGamePacket(
      username: player.username,
      id: player.id,
    ));
  }

  void addObject(GameObject gameObject) {
    _gameObjects[gameObject.id] = gameObject;
    gameObject.world = this;
    broadcast(SpawnPacket(
      object: gameObject,
    ));
  }

  void removeObject(GameObject gameObject) {
    _gameObjects.remove(gameObject.id);
    gameObject.world = null;
    broadcast(DestroyPacket(
      id: gameObject.id,
    ));
  }

  void broadcast(OutgoingPacket packet) {
    for (var player in players) {
      player.connection.send(packet);
    }
  }

  void update(double deltaTime) {
    for (var gameObject in gameObjects) {
      gameObject.update(deltaTime);
    }
  }
}
