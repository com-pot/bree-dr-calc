import beastsStore from "@/modules/bestiary/store/beastsStore"
import localCollection from "@typeful/storage/collection/controllers/localCollection"
import { defineAppModule, stripSchemaModules } from "@typeful/vue-app/AppModule"

export default defineAppModule({
  models: stripSchemaModules(import.meta.glob("./*.schema.json", {eager: true, import: 'default'})),
  types: {
    sex: {
      type: "string", appearance: "btn-group",
      options: 'bestiary:sex',
    },
    geneticGrade: {
      type: "string",
    },
    behaviorGrade: {
      type: "string",
    },
    healthGrade: {
      type: "string",
    },
    bonity: {
      type: "string",
    },
  },
  getCollections() {
    return {
      'bestiary:sex': localCollection(() => [{value: 'm'}, {value: 'f'}], {
        ui: {
          createLabel: { prefix: '@com-pot/bestiary.sex.' },
        },
      }),
      'bestiary:beast': localCollection(() => beastsStore.state.beastList, {
        valueKey: 'id',
        ui: {
          createLabel: {
            type: 'template',
            template: {
              op: 'join', separator: ' ',
              filter: 'non-empty',
              args: [
                {path: ['general', 'name']},
                {path: ['general', 'breedingStation']},
                {path: ['general', 'sex']},
              ],
            },
          },
        },
      }),
      'bestiary:breedingStation': localCollection(() => beastsStore.state.breedingStations, {
        valueKey: 'id',
        ui: {
          createLabel: {
            type: 'template',
            template: [
              {path: ['name']},
              {const: ' ['},
              {path: ['country']},
              {const: ']'},
            ],
          }
        }
      }),
    }
  },
})
