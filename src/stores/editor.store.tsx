import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import { computed, makeAutoObservable } from "mobx";

import { Application } from "@/engine";
import { GameObject, Scene } from "@/engine/scene";

export class SerializableProperty<T = any> {
  private _value: T;

  constructor(
    public propertyPath: string,
    public owner: SerializableObject<any>,
    public initialValue: T,
  ) {
    this._value = initialValue;
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  public get name() {
    return this.propertyPath.split(".").pop();
  }

  public get value() {
    return this._value;
  }

  public setValue(newValue: T) {
    this._value = newValue;

    this.apply();
  }

  public get isDirty() {
    return this._value !== this.initialValue;
  }

  public get isArray() {
    return Array.isArray(this._value);
  }

  // Utility methods
  public map<U>(
    // @ts-expect-error -- typescript is being weird, but it works
    callbackfn: (value: T[number], index: number, array: T[]) => U,
    thisArg?: any,
  ): U[] {
    return (this._value as any[]).map(callbackfn, thisArg);
  }

  public getProperty<T = any>(path: string): SerializableProperty<T> {
    return this.owner.getProperty(`${this.propertyPath}.${path}`);
  }
  //

  public apply() {
    this.owner.setProperty(this.propertyPath, this._value);
  }
}

export class SerializableObject<T extends Record<string, any>> {
  public data: T;
  private propertyCache: Map<string, SerializableProperty>;

  constructor(
    data: T,
    private onChange?: () => void,
  ) {
    this.data = data;
    this.propertyCache = new Map();
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  public getProperties() {
    return Object.keys(this.data).map((key) => this.getProperty(key));
  }

  public getProperty<T = any>(path: string): SerializableProperty<T> {
    if (this.propertyCache.has(path)) {
      return this.propertyCache.get(path) as SerializableProperty<T>;
    }

    const value = lodashGet(this.data, path);

    if (value === undefined) {
      throw new Error(`Property at path "${path}" not found.`);
    }

    const property = new SerializableProperty<T>(path, this, value);
    this.propertyCache.set(path, property);

    return property;
  }

  public setProperty<T = any>(path: string, value: T) {
    lodashSet(this.data, path, value);

    if (this.propertyCache.has(path)) {
      const cachedProperty = this.propertyCache.get(path) as SerializableProperty<T>;
      cachedProperty.initialValue = value;
    }

    if (this.onChange) {
      this.onChange();
    }
  }

  public toJSON() {
    return JSON.parse(JSON.stringify(this.data));
  }
}

export class EditorStore {
  serializedScene: SerializableObject<Scene>;
  selectedGameObjectPath: string | null = null;

  constructor(
    public application: Application,
    scene?: Scene,
  ) {
    this.serializedScene = new SerializableObject(scene ?? new Scene("Untitled Scene"), () => {
      application.saveToDisk();
    });

    makeAutoObservable(
      this,
      {
        scene: computed.struct,
      },
      { autoBind: true },
    );
  }

  public get scene(): Scene {
    return this.serializedScene.data;
  }

  public get gameObjects() {
    return this.serializedScene.getProperty<GameObject[]>("gameObjects");
  }

  public setSerializedScene(scene: Scene) {
    this.serializedScene = new SerializableObject(scene, () => {
      this.application.saveToDisk();
    });
  }

  public selectGameObject(uuid: string | null) {
    if (!uuid) {
      this.selectedGameObjectPath = null;
      return;
    }

    const index = this.gameObjects.value.findIndex((go) => go.uuid === uuid);

    if (index === -1) {
      throw new Error(`GameObject with uuid "${uuid}" not found.`);
    }

    this.selectedGameObjectPath = `gameObjects[${index}]`;
  }

  public get selectedGameObject() {
    if (!this.selectedGameObjectPath) {
      return null;
    }

    return this.serializedScene.getProperty<GameObject>(this.selectedGameObjectPath);
  }
}
