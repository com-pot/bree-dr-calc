<script lang="ts" setup>
import {defineProps, ref, watch} from "vue"

import {useI18n} from "@i18n"
import {
  collectionPage,
  useCollections
} from "@vtf-collection"
import ComposableFilter from "@vtf-ui/ComposableFilter.vue"
import Pagination from "@vtf-ui/Pagination.vue"

import * as beastsStore from "../store/beastsStore"
import {Beast} from "../model/Bestiary"
import ComposableSorting from "@vtf-ui/ComposableSorting.vue";
import useModel from "@typeful/model-vue/useModel"
import { createListController } from "libs/@typeful/storage-vue/src/listController"


const props = defineProps({
  ...collectionPage.props,
})

const i18n = useI18n()
const t = i18n.t
const collections = useCollections()
const model = useModel('@com-pot/bestiary.beast')

const list = createListController<Beast>({
  availableFields: model.locate().fields('all')
    .filter((ref) => ref.name !== 'birthDay'),

  sort: {
    toggleRemove: false,
    defaultSorting: ['general', 'name'],
  },

  fetchItems: (filter, sort, pagination) => collections.fetchCollection<Beast>('bestiary:beast', undefined, filter, sort, pagination),
})

const deleteId = ref<string | null>(null)
watch(() => props.page, (page) => list.pagination.page = page)

function deleteBeast(id: string) {
  if (deleteId.value !== id) {
    deleteId.value = id
    return
  }
  beastsStore.actions.deleteBeast(id)
}
</script>

<template>
  <div class="beast-index flow-block">
    <div class="section-heading">
      <h1>{{ t('bestiary.view.MyBeasts') }}</h1>
      <router-link :to="{name: 'bestiary.NewBeast'}" class="btn btn-primary ml-auto">{{
          t('bestiary.actions.createBeast')
        }}
      </router-link>
      <router-link :to="{name: 'bestiary.Pairing'}" class="btn btn-outline-primary ml-2">{{
          t('bestiary.view.Pairing')
        }}
      </router-link>
    </div>

    <div class="list-options">
      <ComposableFilter v-if="list.filter" :ctrl="list.filter"/>
      <ComposableSorting v-if="list.sort" :ctrl="list.sort"/>
    </div>

    <div class="list-items" v-if="list.data.ready">
      <div v-for="beast in list.data.value.items" :key="beast.id" class="card card-beast">
        <span class="gender">{{ t('bestiary.beast.gender.' + (beast.general.gender || '?')) }}</span>

        <div class="beast-text">
          <span class="full-name">
            <span class="name">{{ beast.general.name }}</span>
            <span class="station">&nbsp;{{
                beastsStore.getters.breedingStationName(beast.general.breedingStation) || 'Neznámá stanice'
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

    <Pagination v-if="list.data.ready && list.data.value.pagination" v-model:page="list.pagination.page" :max-page="list.getTotalPages()" class="mt-2"/>
  </div>
</template>

<style lang="scss">
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
