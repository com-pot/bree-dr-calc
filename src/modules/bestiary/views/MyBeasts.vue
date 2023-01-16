<script lang="ts" setup>
import {watch} from "vue"

import {useI18n} from "@typeful/vue-app/i18n"

import * as beastsStore from "../store/beastsStore"
import {Beast} from "../model/Bestiary"
import useModel from "@typeful/model-vue/useModel"
import { createListController } from "@typeful/storage-vue/listController"
import { collectionComponentProps, useCollections } from "@typeful/storage-vue/collections"
import CollectionView from "@typeful/storage-vue/components/CollectionView"
import { useDeleteConfirmation } from "@typeful/vue-utils/useConfirmation"


const props = defineProps({
  ...collectionComponentProps,
})

const i18n = useI18n()
const collections = useCollections()
const model = useModel('@com-pot/bestiary.Beast')

const list = createListController<Beast>({
  availableFields: model.locate().fields('all'),

  sort: {
    toggleRemove: false,
    defaultSorting: ['general', 'name'],
  },

  fetchItems: (filter, sort, pagination) => collections.fetchCollection<Beast>('bestiary:beast', undefined, filter, sort, pagination),
})
list.load()

const deleteConfirmation = useDeleteConfirmation<string>((ref) => {
  return beastsStore.actions.deleteBeast(ref)
})
watch(() => props.page, (page) => list.pagination.page = page)

const sexIcons: Record<string, string> = {
  m: 'material-symbols:male-rounded',
  f: 'material-symbols:female-rounded',
  default: 'material-symbols:question-mark-rounded',
}
function getSexIcon(gender: string) {
  return sexIcons[gender] ?? sexIcons.default
}

</script>

<template>
  <div class="beast-index flow-block">
    <div class="section-heading">
      <router-link :to="{name: 'bestiary.NewBeast'}" class="btn btn-fab btn-outline-primary"
                   :aira-label="i18n.t('bestiary.actions.createBeast')"
                   :title="i18n.t('bestiary.actions.createBeast')"
      >
        <iconify-icon icon="material-symbols:add"/>
      </router-link>
      <h1>{{ i18n.t('bestiary.view.MyBeasts') }}</h1>

      <router-link :to="{name: 'bestiary.Pairing'}" class="btn btn-outline-primary">{{ i18n.t('bestiary.view.Pairing') }}</router-link>
    </div>

    <CollectionView :ctrl="list" flow="block">
      <template #item="{item}">
        <div
          class="card entity-card"
          :data-entity="model.spec.meta.name"
        >
        <iconify-icon :icon="getSexIcon(item.general.sex)"
                      data-name="sex" :aria-label="$t('@com-pot/bestiary.sex.' + (item.general.sex ?? '?'))"
        />

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
          <button :class="['btn btn-sm', deleteConfirmation.value === item.id ? 'btn-outline-danger' : 'btn-outline-warning']"
                  @click="deleteConfirmation.delete(item.id)"
          >{{ i18n.t('app.generic.remove') }}
          </button>
        </div>
      </template>
    </CollectionView>
  </div>
</template>

<style lang="scss">
[data-entity="@com-pot/bestiary.Beast"].card {
  [data-name="sex"] {
    font-size: 2rem;
    margin-inline-end: 0.25em;
  }

  .full-name {
    font-weight: bold;
  }

  [data-name="evidence-code"] {
    color: dimgray;
  }
}
</style>
