import "./app.scss";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Application } from "./engine";
import { Card, CardContent } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ScrollArea } from "./components/ui/scroll-area";
import { TreeNode, TreeView } from "./components/ui/tree-view";
import { GameObject } from "./engine/scene";
import { EditorStore } from "./stores/editor.store";
import { observer } from "mobx-react-lite";
import { GameObjectInspector } from "./components/editor/gameobject-inspector";

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
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    app.init().then(() => {
      store.setSerializedScene(app.scene);
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
        <CardContent className="p-0">
          <Tabs defaultValue="tab1" className="">
            <TabsList className="w-full justify-start rounded-b-none">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            </TabsList>

            <TabsContent value="tab1" className="m-0">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit exercitationem
              laudantium necessitatibus quia, a sed libero, vitae, commodi est illo itaque atque!
              Iusto, consequuntur eligendi enim veniam reprehenderit explicabo excepturi!
            </TabsContent>
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
