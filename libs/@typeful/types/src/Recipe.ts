export type Recipe = any

export function compileRecipeEvalFn(recipe: Recipe) {
  console.warn("Recipe not compiled", recipe);

  return (ctx: Record<string, any>) => {
    throw new Error('Recipe not implemented, ' + !!ctx)
  }
}
