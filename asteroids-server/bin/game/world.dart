import 'gameobject.dart';
import 'interfaces/updateable.dart';

class World implements Updateable {
  Function? onAdd;
  Function? onRemove;

  List<GameObject> _gameObjects = [];

  List<GameObject> get gameObjects => _gameObjects;

  void addObject(GameObject gameObject) {
    _gameObjects.add(gameObject);
    // this.onAdd(gameObject);
    gameObject.world = this;
  }

  void removeObject(GameObject gameObject) {
    var index = _gameObjects.indexOf(gameObject);
    if (index != -1) {
      _gameObjects.removeAt(index);
      gameObject.world = null;
      // this.onRemove(gameObject);
    }
  }

  void update(double deltaTime) {
    for (var gameObject in _gameObjects) {
      gameObject.update(deltaTime);
    }
  }
}
