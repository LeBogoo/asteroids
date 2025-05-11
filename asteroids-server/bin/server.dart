import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';
import 'package:shelf_static/shelf_static.dart';
import 'package:packet_networking/packet_networking.dart';

import 'handlers/version_handler.dart';
import 'middlewares/cors_middleware.dart';

class Server {
  final Router _router = Router();
  final PacketServer _packetServer = PacketServer("asteroids");

  Server() {
    _setupRoutes();

    _packetServer.onConnection((connection) {
      connection.send(ErrorPacket(error: "backend not implemented"));
    });
  }

  void _setupRoutes() {
    _router.get('/api/ws', _packetServer.handler);
    _router.get('/api/version', versionHandler());
  }

  Handler get handler {
    final staticHandler =
        createStaticHandler('static', defaultDocument: 'index.html');

    return Pipeline()
        .addMiddleware(logRequests())
        .addMiddleware(corsMiddleware())
        .addHandler((Request request) async {
      final response = await _router(request);
      if (response.statusCode != 404 || request.url.path.startsWith('api')) {
        return response;
      }

      final staticResponse = await staticHandler(request);
      if (staticResponse.statusCode == 404) {
        return Response.ok(await File('static/index.html').readAsString(),
            headers: {
              HttpHeaders.contentTypeHeader: 'text/html',
            });
      }
      return staticResponse;
    });
  }
}

Map<String, String> loadEnvironment() {
  final env = {...Platform.environment};
  try {
    final envFile = File('.env');
    if (envFile.existsSync()) {
      // read line by line and split by '='. Add to environment
      for (var line in envFile.readAsLinesSync()) {
        final parts = line.split('=');
        if (parts.length >= 2) {
          final key = parts[0].trim();
          final value = parts.sublist(1).join('=').trim();
          env[key] = value;
        }
      }
    }
  } catch (e) {
    print('Error loading .env file: $e');
  }

  return env;
}

void main(List<String> args) async {
  final env = loadEnvironment();

  final server = Server();

  final ip = InternetAddress.anyIPv4;
  final port = int.parse(env['PORT'] ?? '8080');

  final httpServer = await io.serve(server.handler, ip, port);
  print(
      'Server v${env["VERSION"] ?? "0.0.0"} listening on port ${httpServer.port}');
}
