export function compileRecipeEvalFn(recipe: Recipe) {
  console.warn("Recipe not compiled", recipe);

  return (ctx: Record<string, any>) => {
    return 'nada'
  }
}

export type Recipe = any
