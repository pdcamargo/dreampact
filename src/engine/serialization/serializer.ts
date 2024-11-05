import { Component } from "../components";
import { Scene } from "../scene";
import * as modules from "./serialize-modules";
import type { SerializationModule } from "./serialize-modules/module-types";

const prototypesToIgnore = ["Entity"];

export class Serializer {
  private static modules: Map<string, SerializationModule<any>> = new Map();

  static register<T>(module: SerializationModule<T>) {
    this.modules.set(module.typeName, module);
  }

  static serialize<T>(data: T): any {
    if (data === null || data === undefined) {
      return data;
    }

    const prototypeName = (data as any).constructor.name;

    if (prototypesToIgnore.includes(prototypeName)) {
      return undefined;
    }

    if (this.modules.has(prototypeName)) {
      return {
        __type: prototypeName,
        data: this.modules.get(prototypeName)!.serialize(data),
      };
    }

    if (typeof data === "object") {
      if (Array.isArray(data)) {
        return data.map((item) => this.serialize(item));
      } else {
        const serializedObject: any = {};

        if (data instanceof Component) {
          return {
            __type: data.constructor.name,
            data: (() => {
              const obj: any = {};
              const keys = Object.keys(data).filter(
                // all components have entity and scene so we ignore them
                (key) => !["entity", "scene"].includes(key),
                // TODO: serialization decorator or any other strategy
              );

              console.log({ keys });

              for (const key of keys) {
                obj[key] = this.serialize((data as any)[key]);
              }

              return obj;
            })(),
          };
        }

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const val = (data as any)[key];

            if (val instanceof Scene || prototypesToIgnore.includes(val.constructor.name)) {
              continue;
            }

            serializedObject[key] = this.serialize((data as any)[key]);
          }
        }
        return serializedObject;
      }
    }

    return data;
  }

  static deserialize<T = any>(data: any): T {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === "object" && data !== null && data.__type) {
      const type = data.__type;

      if (this.modules.has(type)) {
        return this.modules.get(type)!.deserialize(data.data);
      }
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.deserialize(item)) as any;
    } else if (typeof data === "object") {
      const deserializedObject: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          deserializedObject[key] = this.deserialize(data[key]);
        }
      }
      return deserializedObject;
    }

    return data;
  }
}

Object.values(modules).forEach((module) => Serializer.register(module as any));
