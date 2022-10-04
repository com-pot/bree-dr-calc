import {PropertyType, TypefulModule} from "@vtf-typeful"
import {useI18n} from "@i18n"

import localCollection from "@/modules/appCollections/localCollection"
import * as gender from "./gender.type"
import {BreedingStation} from "@/modules/bestiary/model/Bestiary"
import {createBeastListItem} from "@/modules/bestiary/model/beastItemsSource"
import beastsStore from "@/modules/bestiary/store/beastsStore"

const fetchTypes: { [baseType: string]: (variant: string) => PropertyType } = {
  coatType: (variant: string): PropertyType => ({
    type: "select",
    options: variant + ':coatType',
  }),
  coatPaint: (variant: string): PropertyType => ({
    type: "select",
    options: variant + ':coatPaint',
  }),

}

const module: TypefulModule = {
  types: {
    gender: {
      type: "string", appearance: "btn-group",
      options: gender.options,
      ui: {itemPrefix: 'bestiary.beast.gender.'},
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

    'relation.beast': {
      type: "string",
      options: "relation:beast",
      valueKey: 'id',
      ui: {
        itemLabelTemplate: {
          op: 'join', separator: ' ',
          filter: 'non-empty',
          args: [
            {path: ['name']},
            {path: ['breedingStation']},
            {path: ['gender']},
          ],
        },
      },
    },
    'relation.breedingStation': {
      type: "select",
      options: "bestiary:breedingStation",
      valueKey: 'id',
      ui: {
        itemLabelTemplate: [
          {path: ['name']},
          {const: ' ['},
          {path: ['country']},
          {const: ']'},
        ],
      },
    }
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
  registerItemSources(collections) {
    collections.addCollectionEntry('relation:beast', localCollection(() => beastsStore.state.beastList, createBeastListItem))
    collections.addCollectionEntry('bestiary:beast', localCollection(() => beastsStore.state.beastList))
    collections.addCollectionEntry('bestiary:breedingStation', localCollection(() => beastsStore.state.breedingStations))
  },
}

export default module
