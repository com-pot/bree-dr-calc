<script lang="ts" setup>
import {defineProps, ref, watch} from "vue"

import {useI18n} from "@i18n"

import * as beastsStore from "../store/beastsStore"
import {Beast} from "../model/Bestiary"
import useModel from "@typeful/model-vue/useModel"
import { createListController } from "@typeful/storage-vue/listController"
import { collectionComponentProps } from "@typeful/storage-vue/collections"


const props = defineProps({
  ...collectionComponentProps,
})

const i18n = useI18n()
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
      <h1>{{ i18n.t('bestiary.view.MyBeasts') }}</h1>
      <router-link :to="{name: 'bestiary.NewBeast'}" class="btn btn-primary ml-auto">{{ i18n.t('bestiary.actions.createBeast') }}</router-link>
      <router-link :to="{name: 'bestiary.Pairing'}" class="btn btn-outline-primary ml-2">{{ i18n.t('bestiary.view.Pairing') }}</router-link>
    </div>

    <CollectionView>
      <template #item="{item}">
        <div
          class="card entity-card"
          :data-entity="model.spec.meta.name"
        >
          <span data-name="gender">{{ i18n.t('bestiary.beast.gender.' + (item.general.gender || '?')) }}</span>

          <div class="text-stack">
            <span class="full-name">
              <span data-name="name">{{ item.general.name }}</span>
              <span data-name="breedingStation">&nbsp;{{
                  beastsStore.getters.breedingStationName(item.general.breedingStation) || 'Neznámá stanice'
                }}</span>
            </span>
            <span data-name="evidence-code">{{ item.general.evidenceCode || 'Bez evidenčního čísla' }}</span>
          </div>

          <router-link :to="{name: 'bestiary.BeastDetail', params: {beastId: item.id}}"
                      class="btn btn-sm btn-light ml-auto">{{ i18n.t('app.generic.edit') }}
          </router-link>
          <button :class="['btn btn-sm', deleteId === item.id ? 'btn-outline-danger' : 'btn-outline-warning']"
                  @click="deleteBeast(item.id)"
          >{{ i18n.t('app.generic.remove') }}
          </button>
        </div>
      </template>
    </CollectionView>
  </div>
</template>

<style lang="scss">
[data-entity="@com-pot/bestiary.beast"].card {
  [data-name="gender"] {
    padding: 0.5em;
  }

  .full-name {
    font-weight: bold;
  }

  [data-name="evidence-code"] {
    color: dimgray;
  }
}
</style>
