import {PropertyType, TypefulModule} from "@/modules/typeful/TypefulModule";
import * as gender from "@/modules/bestiary/typeful/gender.type";
import * as i18n from "@/i18n";

const fetchTypes: { [baseType: string]: (variant: string) => PropertyType } = {
  coatType: (variant: string): PropertyType => ({
    type: "select",
    itemsSource: variant + ':coatType',
  }),
  coatPaint: (variant: string): PropertyType => ({
    type: "select",
    itemsSource: variant + ':coatPaint',
  }),
}

const module: TypefulModule = {
  types: {
    gender: {
      type: "btnSelect",
      options: gender.options.map((option) => ({
        value: option.value,
        label: i18n.translate('bestiary.beast.gender.' + option.value),
      })),
    },
    geneticGrade: {
      type: "text",
    },
    behaviorGrade: {
      type: "text",
    },
    healthGrade: {
      type: "text",
    },
    bonity: {
      type: "text",
    },
  },
  getPropertyType: (type, variant) => {
    if (type in fetchTypes && variant) {
      return fetchTypes[type](variant)
    }
    const types = module.types!
    if (type in types) {
      return types[type]
    }

    return undefined
  },
}

export default module
