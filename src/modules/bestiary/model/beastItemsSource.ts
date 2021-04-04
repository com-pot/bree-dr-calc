import {ItemSourceAccessor} from "@/modules/typeful/services/ItemsSourceRegistry";

import * as beastsStore from "../store/beastsStore"
import {GenderType} from "@/modules/bestiary/typeful/gender.type";
import {Beast} from "@/modules/bestiary/model/Bestiary";

type BeastListItem = {
  id: Beast['id'],
  name: string,
  breedingStation?: string,
  gender?: GenderType,
}

const createBeastListItem = (beast: Beast): BeastListItem => ({
  id: beast.id,
  name: beast.general.name,
  breedingStation: beast.general.breedingStation,
  gender: beast.general.gender
})

export const listItems: ItemSourceAccessor<BeastListItem> = (_, domain?) => {
  const beasts: BeastListItem[] = beastsStore.state.beastList.map(createBeastListItem)
  if (!domain) {
    return beasts
  }

  return beasts
    .filter((beast) => {
      if (domain.gender && beast.gender) {
        return domain.gender === beast.gender
      }

      return true
    })
}
