import { BaseDirectory, readTextFile, writeTextFile, mkdir, exists } from "@tauri-apps/plugin-fs";
import { appConfigDir, resolve } from "@tauri-apps/api/path";
import { Serializer } from "./serialization";
import { Scene } from "./scene";

type ClassConstructor<T> = new (...args: any[]) => T;

export class Application {
  // TODO: refactor a lof of this stuff, but fine for now
  scenePath = "C:\\Users\\Meu Computador\\dev\\dreampact\\src\\game\\src\\prototype.dpscene";

  #scene!: Scene;

  static #instance: Application;

  constructor() {
    Application.#instance = this;
  }

  public async saveToDisk() {
    console.log("Saving to disk...");
    let serializedScene = Serializer.serialize(this.#scene);

    if (typeof serializedScene !== "string") {
      serializedScene = JSON.stringify(serializedScene, null, 2);
    }

    return writeTextFile(this.scenePath, serializedScene);
  }

  public get scene() {
    return this.#scene!;
  }

  public static getInstance() {
    if (!Application.#instance) {
      Application.#instance = new Application();
    }

    return Application.#instance;
  }

  public static get scene() {
    return Application.getInstance().scene;
  }

  public async init() {
    const scene = await this.loadScene();

    const serScene = Serializer.deserialize<Scene>(scene);

    this.#scene = serScene;
  }

  private async loadScene() {
    let lastLoadedScene = (await this.getLastLoadedScenePath())?.path;

    if (!lastLoadedScene) {
      await this.saveLastLoadedScene(this.scenePath);

      lastLoadedScene = this.scenePath;
    }

    const scene = await readTextFile(lastLoadedScene);

    return JSON.parse(scene);
  }

  private async getLastLoadedScenePath() {
    try {
      await this.ensureAppConfigDir();

      const appPath = await appConfigDir();

      const lastLoadedScene = await readTextFile(await resolve(appPath, "editor.json"));

      return JSON.parse(lastLoadedScene) as { path: string };
    } catch {
      return null;
    }
  }

  private async saveLastLoadedScene(scenePath: string) {
    const appPath = await appConfigDir();

    await this.ensureAppConfigDir();

    await writeTextFile(
      await resolve(appPath, "editor.json"),
      JSON.stringify({
        path: scenePath,
      }),
      {
        baseDir: BaseDirectory.Cache,
      },
    );
  }

  private async ensureAppConfigDir() {
    if (!(await exists(await appConfigDir()))) {
      await mkdir(await appConfigDir(), { recursive: true });
    }
  }
}
