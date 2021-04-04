import beastsStore from "@/modules/bestiary/store/beastsStore";
import authStore from "@/modules/auth/store/authStore";

export function loadBestiaryData() {
  const loadBeats = fetch('/api/bestiary/demo-beasts.json')
    .then((response) => response.json())
    .then((beasts) => beastsStore.state.beastList = beasts)
  const loadStations = fetch('/api/bestiary/demo-stations.json')
    .then((response) => response.json())
    .then((stations) => beastsStore.state.breedingStations = stations)

  return Promise.all([loadBeats, loadStations])
    .then(() => {
      beastsStore.persistBeastsList()
      beastsStore.persistStations()
    })
}

const actions = {
  initDemoData() {
    return loadBestiaryData()
      .then(() => {
        authStore.actions.logIn("Demo chovatel")
      })
  },
}

export default {
  actions
}
