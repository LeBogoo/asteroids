import 'dart:io';

import 'package:shelf/shelf.dart';

Function versionHandler() {
  return (Request request) {
    final version = Platform.environment['VERSION'] ?? '0.0.0';
    final commit = Platform.environment['GIT_COMMIT'] ?? 'xxxxxxx';
    return Response.ok('{"version": "$version", "commit": "$commit"}',
        headers: {HttpHeaders.contentTypeHeader: 'application/json'});
  };
}
