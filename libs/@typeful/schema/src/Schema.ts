import { Recipe } from "@typeful/model/recipes";

export type Schema = {
  type: string,

  properties?: Record<string, Schema>,

  options?: string | any[] | OptionsObj,
}

// TODO: Move this type where it belongs. Where that is is TBD.
export type OptionsObj = {
  source: string,
  filter?: Recipe,
}
