import { Schema } from "@typeful/schema/Schema"
import { FieldPath } from "./path/pathTypes"

export type TypefulModel = {
  schema: Schema,
}

export type FieldRef = {
  name: string,
  path: FieldPath,
  schema: Schema,
  ui: Record<string, any>,
}
export type FieldNotFoundRef = {
  name: false,
  path: FieldPath,
}
