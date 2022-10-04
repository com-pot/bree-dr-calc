import getNested from "lodash/get"

import {FilterArgument, FilterCondition, FilterOptions} from "@vtf-collection"

type FilterTypeEvaluator = (value: any, argument: FilterArgument) => boolean
const filterTypeEvaluators: { [type: string]: FilterTypeEvaluator } = {
  '=': (value, argument) => value === argument,
  '~=': (value, argument) => value == argument,
  '>': (value, argument) => value > argument,
  '>=': (value, argument) => value >= argument,
  '<': (value, argument) => value < argument,
  '<=': (value, argument) => value <= argument,
  'in': (value, argument) => {
    if (!Array.isArray(argument)) {
      console.warn("Filter argument is not an array")
      return false
    }
    return argument.includes(value)
  },
  'like': (value, argument) => {
    if (typeof value === 'string') {
      return value.includes(argument)
    }
    console.warn("Cannot match 'like' operator with ", {value, argument});

    return false
  }
}

export function evaluateFilterCondition<T>(item: T, condition: FilterCondition): boolean {
  const value = getNested(item, condition.prop)

  const evaluator = filterTypeEvaluators[condition.type]
  if (!evaluator) {
    console.warn("No evaluator for condition type ", condition.type)
    return false
  }

  return evaluator(value, condition.args)
}

export function matchFilterFn<T>(filter: FilterOptions): (item: T) => boolean {
  return (item: T) => filter.every((condition) => {
    return evaluateFilterCondition(item, condition) === !condition.neg
  })
}
