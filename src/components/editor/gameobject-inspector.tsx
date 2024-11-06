import { observer } from "mobx-react-lite";

import { Input } from "../ui/input";

import { Vector2Like } from "@/engine/math";
import { GameObject } from "@/engine/scene";
import { cn } from "@/lib/utils";
import { SerializableProperty } from "@/stores/editor.store";

export type GameObjectInspectorProps = {
  gameObject: SerializableProperty<GameObject>;
};

const InputWrapper = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-3", className)}>
    <label className="text-xs font-bold uppercase">{label}</label>

    <div className="flex-1 w-full flex gap-2">{children}</div>
  </div>
);

const Vector2Input = observer(
  ({
    value,
    onValueChange,
  }: {
    value: SerializableProperty<Vector2Like>;
    onValueChange: (newValue: Vector2Like) => void;
  }) => {
    const x = value.getProperty("x");
    const y = value.getProperty("y");

    return (
      <InputWrapper label={value.name || ""}>
        <InputWrapper className="gap-1" label="x">
          <Input
            value={x.value.toString()}
            onChange={(e) => x.setValue(parseFloat(e.target.value))}
          />
        </InputWrapper>
        <InputWrapper className="gap-1" label="y">
          <Input
            value={y.value.toString()}
            onChange={(e) => y.setValue(parseFloat(e.target.value))}
          />
        </InputWrapper>
      </InputWrapper>
    );
  },
);

export const GameObjectInspector = observer(({ gameObject }: GameObjectInspectorProps) => {
  const name = gameObject.getProperty("name");
  const setName = (e: React.ChangeEvent<HTMLInputElement>) => name.setValue(e.target.value);

  return (
    <div className="flex flex-col gap-2 p-3">
      <Input value={name.value} onChange={setName} />

      <Vector2Input
        value={gameObject.getProperty("transform.position")}
        onValueChange={(newValue) =>
          gameObject.getProperty("transform.position").setValue(newValue)
        }
      />
    </div>
  );
});
