<template>
  <div class="beast-index">
    <div class="heading mb-2">
      <h1>{{ $t('bestiary.view.MyBeasts') }}</h1>
      <router-link :to="{name: 'bestiary.NewBeast'}" class="btn btn-primary ml-auto">{{
          $t('bestiary.actions.createBeast')
        }}
      </router-link>
      <router-link :to="{name: 'bestiary.Pairing'}" class="btn btn-outline-primary ml-2">{{
          $t('bestiary.view.Pairing')
        }}
      </router-link>
    </div>

    <div class="beast-listing">
      <div v-for="beast in beastList" :key="beast.id" class="card card-beast">
        <span class="gender">{{ $t('bestiary.beast.gender.' + (beast.general.gender || '?')) }}</span>

        <div class="beast-text">
          <span class="full-name">
            <span class="name">{{ beast.general.name }}</span>
            <span class="station">&nbsp;{{
                breedingStationName(beast.general.breedingStation) || 'Neznámá stanice'
              }}</span>
          </span>
          <span class="evidence-code">{{ beast.general.evidenceCode || 'Bez evidenčního čísla' }}</span>
        </div>

        <router-link :to="{name: 'bestiary.BeastDetail', params: {beastId: beast.id}}"
                     class="btn btn-sm btn-light ml-auto">Upravit
        </router-link>
        <button :class="['btn btn-sm', deleteId === beast.id ? 'btn-outline-danger' : 'btn-outline-warning']"
                @click="deleteBeast(beast.id)"
        >Odebrat
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {translateMixin} from "@/i18n";

import * as beastsStore from "../store/beastsStore"

export default defineComponent({
  mixins: [
    translateMixin,
  ],
  setup() {
    const deleteId = ref<string | null>(null)

    return {
      beastList: beastsStore.state.beastList,

      breedingStationName: beastsStore.getters.breedingStationName,

      deleteId,
      deleteBeast(id: string) {
        if (deleteId.value !== id) {
          deleteId.value = id
          return
        }
        beastsStore.actions.deleteBeast(id)
      },
    }
  },
})
</script>

<style lang="scss">
.beast-index {
  .heading {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.card-beast {
  padding: 0.5em;

  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:first-child) {
    margin-top: 0.5em;
  }

  > *:not(:last-child) {
    margin-right: 0.5em;
  }

  .gender {
    padding: 0.5em;
  }

  .beast-text {
    display: flex;
    flex-direction: column;
  }

  .full-name {
    font-weight: bold;
  }

  .evidence-code {
    color: dimgray;
  }
}
</style>
