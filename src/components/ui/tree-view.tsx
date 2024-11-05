import AccessibleTreeView, { flattenTree, ITreeViewProps, NodeId } from "react-accessible-treeview";

type IFlatMetadata = Record<string, string | number | boolean | undefined | null>;

export type TreeNode<M extends IFlatMetadata> = {
  id?: NodeId;
  name: string;
  isBranch?: boolean;
  children?: TreeNode<M>[];
  metadata?: M;
};

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

const treeViewVariants = cva("", {
  variants: {
    variant: {
      directory: "",
      node: "",
    },
  },
  defaultVariants: {
    variant: "directory",
  },
});

export type TreeViewProps<M extends IFlatMetadata> = Omit<ITreeViewProps, "data" | "nodeRenderer"> &
  VariantProps<typeof treeViewVariants> & {
    data: TreeNode<M>[];
  };

export function TreeView<M extends IFlatMetadata>({ data, variant, ...props }: TreeViewProps<M>) {
  const treeData = useMemo(
    () =>
      flattenTree({
        name: "",
        children: data,
      }),
    [data],
  );

  if (!data.length) {
    return null;
  }

  return (
    <AccessibleTreeView
      data={treeData}
      nodeRenderer={({ element, getNodeProps, level, isExpanded, isSelected, isDisabled }) => {
        const { isBranch, name } = element;

        const { className, ...props } = getNodeProps();

        return (
          <div
            className={cn(
              "flex items-center",
              {
                "cursor-pointer": !isDisabled,
                "bg-purple-600": isSelected,
              },
              className,
            )}
            {...props}
          >
            <div style={{ paddingLeft: 20 * (level - 1) }}>
              {isBranch ? (
                <span className="mr-2">{isExpanded ? "🔽" : "🔼"}</span>
              ) : (
                <span className="mr-2">📄</span>
              )}
              {name}
            </div>
          </div>
        );
      }}
      {...props}
    />
  );
}
