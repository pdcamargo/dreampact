import { GameObject, Scene } from "@/engine/scene";
import { Serializer } from "../serializer";
import { SerializationModule } from "./module-types";
import { componentModule } from "./component-module";

export const gameObjectModule: SerializationModule<GameObject> = {
  typeName: "GameObject",
  serialize(gameObject: GameObject) {
    return {
      name: gameObject.name,
      uuid: gameObject.uuid,
      tag: gameObject.tag,
      layer: gameObject.layer,
      transform: {
        position: Serializer.serialize(gameObject.transform.position),
        rotation: gameObject.transform.rotation,
        scale: Serializer.serialize(gameObject.transform.scale),
      },
      components: gameObject.components.map((component) => componentModule.serialize(component)),
    };
  },
  deserialize(data) {
    const go = new GameObject({
      id: data.uuid,
      name: data.name,
      tag: data.tag,
      layer: data.layer,
      position: Serializer.deserialize(data.transform.position),
      scale: Serializer.deserialize(data.transform.scale),
      rotation: data.transform.rotation,
    });

    data.components.forEach((componentData: any) => {
      const component = componentModule.deserialize(componentData);
      go.addComponent(component);
    });

    return go;
  },
};

export const sceneModule: SerializationModule<Scene> = {
  typeName: "Scene",
  serialize(scene: Scene) {
    return {
      name: scene.name,
      gameObjects: scene.gameObjects.map((go) => gameObjectModule.serialize(go)),
    };
  },
  deserialize(data: { name: string; gameObjects: any[] }) {
    const scene = new Scene(data.name);

    const sceneObjects = data.gameObjects.map((gameObject) => {
      return gameObjectModule.deserialize(gameObject);
    });

    scene.setGameObjects(sceneObjects);

    return scene;
  },
};
