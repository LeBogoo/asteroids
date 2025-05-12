import 'package:web_socket_channel/web_socket_channel.dart';

import '../../packet_networking.dart';
import 'package:packet_networking/src/websocket_connection.dart';
import 'package:shelf_web_socket/shelf_web_socket.dart';
import 'package:shelf/shelf.dart';

class PacketServer {
  final List<Connection> _connections = [];
  List<Connection> get connections => _connections;
  final List<Function(Connection)> _onConnectionCallbacks = [];

  late Handler _handler;
  Handler get handler => _handler;

  PacketServer(String allowedProtocol) {
    _handler = webSocketHandler(
      (WebSocketChannel webSocket, String? protocol) async {
        if (protocol == null || protocol != allowedProtocol) {
          print(
              "[Server] Invalid protocol: $protocol, expected: $allowedProtocol");
          webSocket.sink.close(1002, 'Invalid protocol');
          return;
        }

        WebsocketConnection connection = WebsocketConnection(webSocket);
        print(
            "[Server] New connection from ${webSocket.closeCode ?? 'unknown'}");
        _connections.add(connection);

        connection.onDisconnect(() {
          print("[Server] Connection closed (code: ${webSocket.closeCode})");
          _connections.remove(connection);
        });

        for (var callback in _onConnectionCallbacks) {
          callback(connection);
        }
      },
      protocols: [allowedProtocol],
    );

    _registerPacketTypes();
  }

  void definePacketTypes(Map<IncomingPacket, PacketFactory> packets) {
    for (var entry in packets.entries) {
      PacketRegistry.registerPacket(entry.key, entry.value);
    }
  }

  void _registerPacketTypes() {
    PacketRegistry.registerPacket(PongPacket.empty(), PongPacket.fromJson);
  }

  void onConnection(void Function(Connection connection) callback) {
    _onConnectionCallbacks.add(callback);
  }
}
