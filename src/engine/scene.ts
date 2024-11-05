import { Vector2 } from "./math";

export class Entity {
  public uuid: string;

  constructor(uuid?: string) {
    this.uuid = uuid ?? Math.random().toString(36).substring(2, 9);
  }
}

export class Component extends Entity {}

export type GameObjectOptions = {
  id: string;
  name: string;
  tag?: string;
  layer?: number;
  position?: Vector2;
  scale?: Vector2;
  rotation?: number;
};

export class TransformComponent extends Component {
  position: Vector2;
  scale: Vector2;
  rotation: number;

  constructor(options: Pick<GameObjectOptions, "position" | "scale" | "rotation"> = {}) {
    super();

    this.position = options.position ?? new Vector2();
    this.scale = options.scale ?? new Vector2(1, 1);
    this.rotation = options.rotation ?? 0;
  }
}

export class GameObject extends Entity {
  name: string;
  tag?: string;
  layer?: number;

  readonly transform = new TransformComponent();
  readonly components: Component[] = [];
  readonly children: GameObject[] = [];
  parent?: GameObject;

  constructor(options: GameObjectOptions) {
    super(options?.id);

    this.transform = new TransformComponent({
      position: options.position,
      scale: options.scale,
      rotation: options.rotation,
    });

    this.name = options.name;
    this.tag = options.tag;
    this.layer = options.layer;
  }

  addComponent(component: Component) {
    this.components.push(component);
  }

  public findChildById(id: string, recursive = false): GameObject | undefined {
    return this.children.find((child) => {
      if (child.uuid === id) {
        return true;
      }

      if (recursive) {
        return child.findChildById(id, recursive);
      }

      return false;
    });
  }
}

export class Scene {
  gameObjects: GameObject[] = [];

  constructor(public name: string) {}

  setGameObjects(gameObjects: GameObject[]) {
    this.gameObjects = gameObjects;
  }

  // Find by id with optional resursive search
  findGameObjectById(id: string, recursive = false) {
    return this.gameObjects.find((go) => {
      if (go.uuid === id) {
        return true;
      }

      if (recursive) {
        return go.findChildById(id, recursive);
      }

      return false;
    });
  }
}
