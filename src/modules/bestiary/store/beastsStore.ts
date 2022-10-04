import {reactive} from "vue"
import {v4 as uuidV4} from "uuid"

import {Beast, BreedingStation, EntityState} from "@/modules/bestiary/model/Bestiary"
import BeastFamilyTree, {RelationName} from "@/modules/bestiary/model/BeastFamilyTree"
import {resolveAfter} from "@/utils/AsyncUtils"

import * as WrightCalculation from "../utils/WrightCalculation"

const isId = (param: any): param is Beast['id'] => typeof param === "string"

export const state = reactive({
  breedingStations: [] as BreedingStation[],
  beastList: [] as Beast[],
})

export const getters = {
  breedingStationName: (stationId?: string): string | null => {
    const station = state.breedingStations.find((s) => s.id === stationId)
    if (!station) {
      console.warn("No station with id", stationId)
      return null
    }
    return station.name
  }
}

export const actions = {
  async addBeast(beast: Beast) {
    if (beast.id) {
      throw new Error("Beast already exists")
    }

    let existingBeast
    do {
      beast.id = uuidV4()
      existingBeast = await actions.getBeast(beast.id, 'raw')
    } while (existingBeast)

    state.beastList.push(beast)
    persistBeastsList()
  },
  async updateBeast(beast: Beast) {
    const existingIndex = state.beastList.findIndex((b) => b.id === beast.id)
    if (existingIndex === -1) {
      throw new Error("Beast does not exist")
    }
    state.beastList[existingIndex] = beast
    persistBeastsList()
  },

  async getBeast<T extends Beast<ES>, ES extends EntityState>(id: Beast['id'], entityState: ES): Promise<T | null> {
    const delay = Math.round(50 + Math.random() * 150)
    const beast = state.beastList.find((b) => b.id === id) as T

    if (!beast) {
      console.warn("No beast found with id", id)
    }

    if (entityState === 'populated') {
      console.warn("Populated entity state is not implemented yet")
    }

    return resolveAfter(delay, beast || null)
  },
  async deleteBeast(id: string) {
    const index = state.beastList.findIndex((b) => b.id === id)
    if (index === -1) {
      throw new Error("Beast not found")
    }
    state.beastList.splice(index, 1)
    persistBeastsList()
  },

  /**
   * Loads ancestor tree
   *
   * Using async-recursive iteration loads mother and father relations up to specified generation.
   *
   * This method took quite a while and mental energy so it might be a subject of refactoring.
   * Please consult sane/fresh people.
   */
  async loadAncestors(beast: Beast | Beast['id'], entityState: 'raw', populateGenerations: number = 1): Promise<BeastFamilyTree<'raw'>> {
    if (isId(beast)) {
      const id = beast as Beast['id']
      const loadedBeast = await this.getBeast(id, entityState)
      if (!loadedBeast) {
        throw new Error("Can not find beast with id " + id)
      }
      beast = loadedBeast
    }

    const tree = new BeastFamilyTree(beast as Beast, 'raw')

    function populatePredecessor(b: Beast, relation: RelationName): Promise<Beast | null> {
      return actions.getBeast(b.lineage[relation], entityState)
        .then((predecessor) => {
          if (!predecessor) {
            throw new Error("Predecessor not found")
          }

          tree.putBeastPredecessor(predecessor, b, relation)
          return predecessor
        })
        .catch((error) => {
          console.error("Failed to load predecessor", error)
          return null
        })
    }

    const populateBeastPredecessors = (b: Beast, remainingGenerations: number): Promise<void> => {
      if (remainingGenerations <= 0) {
        return Promise.resolve()
      }

      const promises: Promise<void>[] = []
      if (b.lineage.mother) {
        promises.push(populatePredecessor(b, 'mother')
          .then((p) => {
            if (p && remainingGenerations > 0) {
              return populateBeastPredecessors(p, remainingGenerations - 1)
            }
          }))
      }
      if (b.lineage.father) {
        promises.push(populatePredecessor(b, 'father')
          .then((p) => {
            if (p && remainingGenerations > 0) {
              return populateBeastPredecessors(p, remainingGenerations - 1)
            }
          }))
      }

      return Promise.all(promises) as unknown as Promise<void>
    }

    return populateBeastPredecessors(beast, populateGenerations)
      .then(() => tree)
  },

  async computeWright(motherId: string, fatherId: string, generations: number = 4) {
    const trees = {
      mother: await actions.loadAncestors(motherId, 'raw', generations),
      father: await actions.loadAncestors(fatherId, 'raw', generations)
    }

    const getBeast = (id: string): Beast => {
      const beast = trees.mother.getBeast(id) || trees.father.getBeast(id)
      if (!beast) {
        throw new Error("Can not find beast " + id)
      }
      return beast
    }
    const presence = WrightCalculation.calculateSharedPresence(trees)!
    const multiOccurringBeasts = WrightCalculation.aggregateMultiOccurrence(presence, getBeast)!
    const relevantOccurrences = WrightCalculation.filterCoveredPredecessors(multiOccurringBeasts, trees)
    return WrightCalculation.evaluateWrightCoefficient(relevantOccurrences)
  },

  async createNewStation(station: BreedingStation) {
    const existingStation = state.breedingStations.findIndex((s) => s.id === station.id)
    if (existingStation !== -1) {
      throw new Error("Station already exists")
    }

    state.breedingStations.push(station)
    persistStations()
  },
  async updateStation(station: BreedingStation) {
    const existingStation = state.breedingStations.findIndex((s) => s.id === station.id)
    if (existingStation === -1) {
      throw new Error("Station does not exist")
    }

    state.breedingStations[existingStation] = station
    persistStations()
  },
  async deleteStation(stationId: string) {
    const existingStation = state.breedingStations.findIndex((s) => s.id === stationId)
    if (existingStation === -1) {
      throw new Error("Station does not exist")
    }

    state.breedingStations.splice(existingStation, 1)
    persistStations()
  }
}

const persistBeastsList = () => {
  localStorage.setItem('bestiary.beastList', JSON.stringify(state.beastList))
}
const persistStations = () => {
  localStorage.setItem('bestiary.breedingStations', JSON.stringify(state.breedingStations))
}

export default {
  state,
  getters,
  actions,

  persistBeastsList,
  persistStations,

  resetUserData,
}

initFromLocalStorage()

function initFromLocalStorage() {
  const beastsSerialized = localStorage.getItem('bestiary.beastList')
  if (beastsSerialized) {
    state.beastList = JSON.parse(beastsSerialized)
  }
  const stationsSerialized = localStorage.getItem('bestiary.breedingStations')
  if (stationsSerialized) {
    state.breedingStations = JSON.parse(stationsSerialized)
  }
}

export function resetUserData() {
  state.beastList = []
  localStorage.removeItem('bestiary.beastList')
  state.breedingStations = []
  localStorage.removeItem('bestiary.breedingStations')
}
