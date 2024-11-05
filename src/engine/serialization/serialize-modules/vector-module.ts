import { Color } from "@/engine/math";
import { Vector2 } from "../../math/vector2";
import { Serializer } from "../serializer";
import { SerializationModule } from "./module-types";

export const vector2Module: SerializationModule<Vector2> = {
  typeName: "Vector2",
  serialize(vector: Vector2) {
    return vector.toArray();
  },
  deserialize(data: any) {
    return new Vector2(data[0], data[1]);
  },
};

export const colorModule: SerializationModule<Color> = {
  typeName: "Color",
  serialize(vector: Color) {
    return vector.toArray();
  },
  deserialize(data: any) {
    return new Color(data[0], data[1], data[2], data[3]);
  },
};
