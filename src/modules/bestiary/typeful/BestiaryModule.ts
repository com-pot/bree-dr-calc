import {TypefulModule} from "@vtf-typeful"

import localCollection from "@/modules/appCollections/localCollection"
import * as gender from "./gender.type"
import {createBeastListItem} from "@/modules/bestiary/model/beastItemsSource"
import beastsStore from "@/modules/bestiary/store/beastsStore"

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
  registerItemSources(collections) {
    collections.addCollectionEntry('relation:beast', localCollection(() => beastsStore.state.beastList, createBeastListItem))
    collections.addCollectionEntry('bestiary:beast', localCollection(() => beastsStore.state.beastList))
    collections.addCollectionEntry('bestiary:breedingStation', localCollection(() => beastsStore.state.breedingStations))
  },
}

export default module
