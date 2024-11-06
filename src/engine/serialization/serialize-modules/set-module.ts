import { SerializationModule } from "./module-types";

import { Serializer } from "../serializer";

export const setModule: SerializationModule<Set<any>> = {
  typeName: "Set",
  serialize(set: Set<any>) {
    return Array.from(set.values()).map((value) => Serializer.serialize(value));
  },
  deserialize(data: any) {
    return new Set(data.map((value: any) => Serializer.deserialize(value)));
  },
};
