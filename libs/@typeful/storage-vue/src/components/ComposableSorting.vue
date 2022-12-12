<script lang="ts" setup>
import {PropType} from "vue"
import {useI18n} from "@typeful/vue-app/i18n"
import { FieldRef } from "@typeful/model/Model"
import { SortController } from "@typeful/storage-vue/collection/sorting"

const props = defineProps({
  ctrl: {type: Object as PropType<SortController>, required: true},
})
const i18n = useI18n()

const addSorting = (field: FieldRef) => props.ctrl.toggleSort(field.path)

</script>

<template>
  <section class="list-option -sorting">
    <div class="section-heading">
      {{ i18n.t('storage.collection.section.sorting') }}
      <FieldSelection :fields="ctrl.availableFields" :pick="addSorting">
        <template v-slot:field="{field}">{{ field.label }}</template>
      </FieldSelection>
    </div>

    <div class="sort-rule" v-for="([prop, direction], i) in ctrl.value">
      <div class="input-group input-group-sm">
        <span class="input-group-text">
          <span class="badge badge-light text-danger" @click="ctrl.remove(i)">&times;</span>
          <span>{{ ctrl.getFieldLabel(prop) }}</span>
        </span>

        <div class="input-group-append">
          <button class="btn btn-outline-primary" @click="ctrl.toggleSort(prop)">{{ i18n.t('collections.sortDirection.' + direction) }}</button>
        </div>
      </div>
    </div>
  </section>
</template>
