import { Component } from "@/engine/scene";
import { Serializer } from "../serializer";
import { SerializationModule } from "./module-types";

class SpriteRenderer extends Component {}

//TODO: move this to Engine
class ComponentRegistry {
  private static components: Map<string, typeof Component> = new Map([
    ["SpriteRenderer", SpriteRenderer],
  ]);

  public static getComponentByName(name: string) {
    if (!this.components.has(name)) {
      throw new Error(`Component with name ${name} does not exist`);
    }

    return this.components.get(name)!;
  }
}

export const componentModule: SerializationModule<Component> = {
  typeName: "Component",
  serialize(asset) {
    return {
      __componentType: asset.constructor.name,
      ...Object.entries(asset).reduce((acc, [key, value]) => {
        if (key === "uuid") {
          acc[key] = value;

          return acc;
        }

        acc[key] = Serializer.serialize(value);

        return acc;
      }, {} as any),
    };
  },
  deserialize(data: any) {
    const TheComponent = ComponentRegistry.getComponentByName(data.__componentType);

    const component = new TheComponent();

    Object.entries(data?.data || data || {}).forEach(([key, value]) => {
      if (key === "__componentType" || key === "__type" || key === "uuid") {
        return;
      }

      component[key as keyof typeof component] = Serializer.deserialize(value);
    });

    return component;
  },
};
