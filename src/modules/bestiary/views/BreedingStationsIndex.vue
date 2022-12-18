<script lang="ts" setup>
import {useI18n} from "@typeful/vue-app/i18n"
import RegioFlag from "@typeful/vue-app/i18n/RegioFlag"
import { useWorkingCopy } from "@typeful/vue-form/model"
import { useDeleteConfirmation } from "@typeful/vue-utils/useConfirmation"

import * as beastsStore from "../store/beastsStore"
import {BreedingStation} from "../model/Bestiary"
import BreedingStationForm from "../components/BreedingStationForm.vue"

const i18n = useI18n()

const stations = beastsStore.state.breedingStations
const stationWorkingCopy = useWorkingCopy<BreedingStation>()

function newStation() {
  stationWorkingCopy.init({id: '', name: '', country: 'CZ'})
}
function editStation(id: string) {
  const station = stations.find((s) => s.id === id)!
  stationWorkingCopy.init({...station}, 'store')
}
function saveStation() {
  const station = stationWorkingCopy.value
  if (!station) {
    throw new Error("No station to be saved")
  }

  let savePromise = stationWorkingCopy.origin === 'store'
    ? beastsStore.actions.updateStation(station)
    : beastsStore.actions.createNewStation(station)

  savePromise
    .then(() => stationWorkingCopy.discard())
    .catch((error) => console.error(error))
}

const deleteConfirm = useDeleteConfirmation<string>((id) => beastsStore.actions.deleteStation(id))
</script>

<template>
  <h1>{{ i18n.t('bestiary.view.BreedingStationsIndex') }}</h1>

  <div class="stations-listing">
    <div v-for="station in stations" :key="station.id" class="card card-station">
      <RegioFlag :code="station.country" class="flag"/>
      <div class="station-text">
        <div class="name">{{ station.name }}</div>
        <div class="id">{{ station.id }}</div>
      </div>
      <div class="actions">
        <div class="btn-group btn-group-vertical">
          <div class="btn btn-sm btn-outline-primary" @click="editStation(station.id)">Upravit</div>
          <div :class="[
            'btn btn-sm',
             deleteConfirm.value === station.id ? 'btn-outline-danger' : 'btn-outline-warning'
             ]" @click="deleteConfirm.delete(station.id)">Smazat</div>
        </div>

      </div>
    </div>

    <div v-if="!stations.length">
      Aktuálně zde nejsou žádné chovatelksé stanice
    </div>
  </div>

  <hr/>

  <div class="card">
    <div class="card-header">
      <button v-if="!stationWorkingCopy.value" class="btn btn-sm btn-primary" @click="newStation">Evidovat novou stanici
      </button>
      <button v-if="stationWorkingCopy.value" class="btn btn-sm btn-warning" @click="stationWorkingCopy.discard()">Zavřít</button>
    </div>

    <div v-if="stationWorkingCopy.value" class="card-body">
      <BreedingStationForm :is-persisted="stationWorkingCopy.origin === 'store'" :station="stationWorkingCopy.value"/>
    </div>

    <div v-if="stationWorkingCopy.value" class="card-footer">
      <button class="btn btn-primary" @click="saveStation">Uložit</button>
    </div>
  </div>
</template>

<style lang="scss">
.stations-listing {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  margin-right: -0.5em;

  .card-station {
    flex: 1 1 320px;

    margin-bottom: 0.5em;
    margin-right: 0.5em;
  }
}

.card-station {
  padding: 1em;

  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5em;

  .flag {
    align-self: center;
    font-size: 16pt;
    margin: 0 0.25em;
  }

  .actions {
    min-width: 80px;

    .btn-group {
      width: 100%;
    }
  }

}
</style>
