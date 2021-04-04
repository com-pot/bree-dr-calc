import {ItemSourceAccessor} from "@/modules/typeful/services/ItemsSourceRegistry";
import {BreedingStation} from "../model/Bestiary";
import * as beastsStore from "../store/beastsStore"

export const listItems: ItemSourceAccessor<BreedingStation> = () => {
  return beastsStore.state.breedingStations
}
