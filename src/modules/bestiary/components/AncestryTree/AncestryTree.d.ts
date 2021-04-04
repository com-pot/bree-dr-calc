type TraversalRelation = {}

export type TraversalRules<T = any> = {
  getChildren: (node: T) => T[],
}
