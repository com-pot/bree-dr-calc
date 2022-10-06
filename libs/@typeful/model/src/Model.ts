import { O } from "ts-toolbelt";
import { Schema } from "@typeful/schema/Schema";
import { createPath, FieldPath, FieldPathRaw, isFieldPath, pathToStr } from "./path/pathTypes";
import { ModelSpec } from "./ModelSpec";
import { Recipe } from "@typeful/types/Recipe";

export default class Model<T extends object = any> {

  private readonly fieldLocators: Record<string, FieldLocator> = {}
  public readonly spec: ModelSpec

  constructor(spec: ModelSpec) {
    this.fieldLocators[''] = new FieldLocator(spec.schema)
    this.spec = spec
  }

  locate(path?: FieldPath | FieldPathRaw): FieldLocator {
    const key = path ? pathToStr(path) : ''
    return this.fieldLocators[key]
  }

  setDefaults(target?: O.Partial<T, 'deep'>): T {
    throw new Error("setDefaults not implemented")
  }
}

export type FieldRef = {
  name: string,
  path: FieldPath,
  schema: Schema,

  ui?: Record<string, any> & {
    itemPrefix?: string,
    itemLabelTemplate?: ((item: any) => string) | Recipe
  },
}
export type FieldNotFoundRef = {
  name: false,
  path: FieldPath,
}

export type GetFieldArg = FieldPathRaw | Omit<O.Partial<FieldRef, 'deep'>, 'path'> & {path: FieldPathRaw}

class FieldLocator {
  private fieldIndex: FieldIndex

  constructor(rootSchema: Schema) {
    this.fieldIndex = new FieldIndex()
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
