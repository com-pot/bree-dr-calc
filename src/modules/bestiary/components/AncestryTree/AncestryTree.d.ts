type TraversalRelation = {}

export type TreeNode<T extends object = object, TId extends string|number = string> = {id: TId} & T

export type TraversalRules<T extends object = object> = {
  getChildren: (node: TreeNode<T>) => TreeNode<T>[],
}
