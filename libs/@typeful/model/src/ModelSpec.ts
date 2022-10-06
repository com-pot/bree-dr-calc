import { Schema } from "@typeful/schema/Schema"

export type ModelSpec = {
  meta: {
    name: string,
  },

  schema: Schema & {type: "object"},
}

export type ModelSpecRaw = {
  meta?: {
    name?: string,
  },

  schema: Schema,
}

export const defineModel = <T extends ModelSpec|ModelSpecRaw>(spec: T) => spec
