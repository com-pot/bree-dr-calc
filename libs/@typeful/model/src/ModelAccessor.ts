import { O } from "ts-toolbelt";
import { Schema } from "@typeful/schema/Schema";
import { createPath, FieldPath, FieldPathRaw, isFieldPath, pathToStr } from "./path/pathTypes";
import { FieldNotFoundRef, FieldRef, TypefulModel } from "./TypefulModel";
import { Recipe } from "./recipes";
import { walkSchema } from "@typeful/schema/schemaUtils";

export default class ModelAccessor {

  private readonly fieldLocators: Record<string, FieldLocator> = {}

  constructor(model: TypefulModel) {
    this.fieldLocators[''] = new FieldLocator(model.schema)
  }

  locate(path?: FieldPath | FieldPathRaw): FieldLocator {
    const key = path ? pathToStr(path) : ''
    return this.fieldLocators[key]
  }

}

type GetFieldArg = FieldPathRaw | Omit<O.Partial<FieldRef, 'deep'>, 'path'> & {path: FieldPathRaw}

class FieldLocator {
  private fieldIndex: FieldIndex

  constructor(private readonly rootSchema: Schema) {
    this.fieldIndex = new FieldIndex()

    walkSchema(rootSchema)
      .forEach(([path, schema]) => {
        console.log(`at '${path}' found:`, schema);
      })
  }

  public field(arg: GetFieldArg): FieldRef | FieldNotFoundRef {
    if (!isFieldPath(arg)) {
      const field = this.field(arg.path)
      console.warn("TODO: Merge defs");
      return field
    }

    const candidate = this.fieldIndex.find(arg)
    const entry = candidate?.field
    if (!entry) {
      return {
        name: false,
        path: createPath(...arg),
      }
    }
    return entry
  }

  fields(args: GetFieldArg[]): (FieldRef|FieldNotFoundRef)[]
  fields(args: GetFieldArg[], filterMissing: 'silent' | 'warn'): FieldRef[]
  fields(args: 'all'): FieldRef[]
  fields(args: GetFieldArg[] | 'all', filterMissing?: 'silent' | 'warn') {
    if (args === 'all') {
      console.warn("TODO: get all fields");
      args = []
    }

    const fields = args.map((arg) => this.field(arg))

    if (filterMissing) {
      return fields.filter((ref) => {
        if (ref.name) return true
        if (filterMissing === 'warn') {
          console.warn(`No field found at '${ref.path}'`);
        }

        return false
      })
    }

    return
  }
}

class FieldIndex {
  private index: Record<string, FieldIndexEntryCandidate[]> = {}

  find(path: FieldPathRaw) {
    const candidates = this.index[pathToStr(path)]
    return candidates?.[0]
  }
}

type FieldIndexEntryCandidate = {
  if?: Recipe,
  field: FieldRef,
}
