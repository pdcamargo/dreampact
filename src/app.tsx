import "./app.scss";

import { useEffect } from "react";

import { observer } from "mobx-react-lite";
import * as PIXI from "pixi.js";

import { GameObjectInspector } from "./components/editor/gameobject-inspector";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { TreeNode, TreeView } from "./components/ui/tree-view";
import { Application } from "./engine";
import { GameObject } from "./engine/scene";
import { EditorStore } from "./stores/editor.store";

const gameObjectToTreeNode = (go: GameObject): TreeNode<GameObject & any> => ({
  name: go.name,
  children: go.children.map(gameObjectToTreeNode),
  metadata: go,
  isBranch: go.children.length > 0,
  id: go.uuid,
});

const app = new Application();
const store = new EditorStore(app);

const App = observer(() => {
  useEffect(() => {
    app.init().then(async () => {
      store.setSerializedScene(app.scene);
      const container = document.getElementById("canvas")!;
      container.innerHTML = "";

      const renderer = await PIXI.autoDetectRenderer({
        width: container.clientWidth,
        height: container.clientHeight,
        antialias: true,
        backgroundColor: 0x1099bb,
      });

      container.appendChild(renderer.canvas);

      const atlasData = {
        frames: {
          idle1: {
            frame: { x: 0, y: 0, w: 64, h: 80 },
          },
          idle2: {
            frame: { x: 64, y: 0, w: 64, h: 80 },
          },
          idle3: {
            frame: { x: 128, y: 0, w: 64, h: 80 },
          },
          idle4: {
            frame: { x: 192, y: 0, w: 64, h: 80 },
          },
        },
        meta: {
          image: "Idle-Sheet.png",
          format: "RGBA8888",
          size: { w: 256, h: 80 },
          scale: 1,
        },
        animations: {
          enemy: ["idle1", "idle2", "idle3", "idle4"],
        },
      };

      await PIXI.Assets.load("Idle-Sheet.png");

      // Create the SpriteSheet from data and image
      const spritesheet = new PIXI.Spritesheet(PIXI.Texture.from(atlasData.meta.image), atlasData);

      // Generate all the Textures asynchronously
      await spritesheet.parse();

      const anim = new PIXI.AnimatedSprite(spritesheet.animations.enemy);

      // set the animation speed
      anim.animationSpeed = 0.1666;
      // play the animation on a loop
      anim.play();

      const stage = new PIXI.Container();

      stage.addChild(anim);

      anim.animationSpeed = 0.1666 / 2;

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(stage);
      };

      animate();
    });
  }, []);

  if (!app) {
    return <div>Loading...</div>;
  }

  // const data = flattenTree

  return (
    <main className="flex-1 w-full grid grid-cols-[300px_1fr_300px] grid-rows-1 gap-x-5 p-2 h-full overflow-hidden">
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="tab1" className="">
            <TabsList className="w-full justify-start rounded-b-none">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            </TabsList>

            <TabsContent value="tab1" className="m-0">
              <ScrollArea>
                <div className="h-[200vh]">
                  <TreeView
                    onNodeSelect={(t) => {
                      store.selectGameObject(t?.element?.metadata?.uuid?.toString() ?? null);
                    }}
                    data={store.gameObjects.map((go) => gameObjectToTreeNode(go))}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0 h-full overflow-hidden">
          <Tabs defaultValue="tab1" className="h-full overflow-hidden">
            <TabsList className="w-full justify-start rounded-b-none">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            </TabsList>

            <TabsContent value="tab1" className="m-0 h-full" id="canvas"></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="tab1" className="">
            <TabsList className="w-full justify-start rounded-b-none">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            </TabsList>

            {store.selectedGameObject && (
              <TabsContent value="tab1" className="m-0">
                <GameObjectInspector gameObject={store.selectedGameObject} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
});

export default App;
