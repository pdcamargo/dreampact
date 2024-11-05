import { Serializer } from "../serializer";
import { SerializationModule } from "./module-types";

export const mapModule: SerializationModule<Map<any, any>> = {
  typeName: "Map",
  serialize(map: Map<any, any>) {
    return Array.from(map.entries()).map(([key, value]) => [
      Serializer.serialize(key),
      Serializer.serialize(value),
    ]);
  },
  deserialize(data: any) {
    return new Map(
      data.map(([key, value]: any[]) => [
        Serializer.deserialize(key),
        Serializer.deserialize(value),
      ]),
    );
  },
};
