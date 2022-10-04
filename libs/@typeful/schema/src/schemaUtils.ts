import { TypefulField } from "@vtf-typeful"
import { FieldPathRaw } from "@typeful/model/path/pathTypes"
import { Schema } from "./Schema"

export function walkSchema(schema: Schema): [FieldPathRaw, TypefulField][] {
  const result: [string[], TypefulField][] = []

  const schemaToWalk: {path: string[], name: string, schema: Schema}[] = [
    {path: [], name: '', schema}
  ]

  while (schemaToWalk.length) {
    const currentSchema = schemaToWalk.shift()!

    Object.entries(currentSchema.schema.properties || {})
      .forEach(([name, schema]) => {
        const path = [...currentSchema.path, name]
        if (schema.type === "object") {
          schemaToWalk.push({path, name, schema})
          return
        }

        result.push([path, schema])
      })
  }

  return result
}
