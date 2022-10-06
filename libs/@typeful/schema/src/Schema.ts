import { FieldPathRaw } from "@typeful/model/path/pathTypes";
import { Recipe } from "@typeful/types/Recipe";

export type Schema = {
  type: string,

  properties?: Record<string, Schema | RefSchema>,

  options?: string | any[] | OptionsObj,

  [k: string]: any,
}
export type RefSchema = {
  $ref: string,
  path?: FieldPathRaw,
}

export function isRefSchema(subject: any): subject is RefSchema {
  if (!subject || typeof subject !== "object") {
    return false
  }
  return typeof subject.$ref === "string"
}

// TODO: Move this type where it belongs. Where that is is TBD.
export type OptionsObj = {
  source: string,
  filter?: Recipe,
}
