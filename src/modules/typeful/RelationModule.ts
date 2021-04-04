import {TypefulModule} from "@/modules/typeful/TypefulModule";
import {listItems as listBeats} from "@/modules/bestiary/model/beastItemsSource";
import {listItems as listBreedingStations} from "@/modules/bestiary/model/breedingStationItemsSource";
import * as i18n from "@/i18n";
import {BreedingStation} from "@/modules/bestiary/model/Bestiary";
import beastsStore from "@/modules/bestiary/store/beastsStore";

// TODO: Make relations registerable
const module: TypefulModule = {
  types: {
    'beast': {
      type: "select",
      itemsSource: "relation:beast",
      valueKey: 'id',
      createItemLabel: (beast: any) => {
        const gender = beast.gender ? (i18n.translate('bestiary.beast.gender.' + beast.gender)) : ''
        const station = beastsStore.getters.breedingStationName(beast.breedingStation) || ' von ???'

        return beast.name + ' ' + station + (gender ? ' ' + gender : '')
      },
    },
    'breedingStation': {
      type: "select",
      itemsSource: "relation:breedingStation",
      valueKey: 'id',
      createItemLabel: (station: BreedingStation) => station.name + ' [' + station.country + ']',
    }
  },
  registerItemSources(registry) {
    registry.registerItemsSource('relation:beast', listBeats)
    registry.registerItemsSource('relation:breedingStation', listBreedingStations)
  },
}

export default module
