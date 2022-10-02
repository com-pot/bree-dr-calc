import {reactive} from "vue"
import {PropExpression} from "./expressions"
import {isSchemaField, PreparedField, TypefulSchema} from "@vtf-typeful"
import {getField} from "@vtf-typeful"


type FilterType = '=' | '~=' | '>' | '<' | '>=' | '<=' | 'in' | 'like'
export type FilterArgument = any

export type FilterCondition = {
  prop: PropExpression,
  type: FilterType,
  args: FilterArgument,
  neg?: boolean,
}

export type FilterOptions = FilterCondition[]

export type FilterField = {
  prop: string,
  field: PreparedField,
}

export const createFiltering = (fields: FilterField[]) => {
  const value = reactive([] as FilterOptions)

  return {
    fields,
    value,

    addFilter(prop: string, type: FilterType = '=', args?: any) {
      value.push({
        prop: prop,
        type,
        args,
      })
    },
    removeFilter(i: number) {
      value.splice(i, 1)
    },
    setFilterType(i: number, filterType: FilterType) {
      value[i].type = filterType
    },
    setArgs(i: number, args: any) {
      value[i].args = args
    },
    toggleNegation(i: number) {
      if (value[i].neg) {
        delete value[i].neg
      } else {
        value[i].neg = true
      }
    },
  }
}

export const createFilteringFromSchema = (schema: TypefulSchema, createFieldLabel: string) => {
  const fields: FilterField[] = []

  const schemaToWalk: {path: string, name: string, schema: TypefulSchema}[] = [
    {path: '', name: '', schema}
  ]

  while(schemaToWalk.length) {
    const currentSchema = schemaToWalk.shift()!

    Object.entries(currentSchema.schema).forEach(([name, field]) => {
      const path = (currentSchema.path ? currentSchema.path + '.' : '') + name
      if (isSchemaField(field)) {
        schemaToWalk.push({path, name, schema: field.schema})
        return
      }

      fields.push({
        prop: path,
        field: getField(path, field, {createFieldLabel}),
      })
    })
  }

  return createFiltering(fields)
}

export type Filtering = ReturnType<typeof createFiltering>
