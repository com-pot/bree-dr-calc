<template>
  <section class="list-option -sorting">
    <div class="section-heading">
      Řazení
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
          <button class="btn btn-outline-primary" @click="ctrl.toggleSort(prop)">{{ t('collections.sortDirection.' + direction) }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue"
import {useI18n} from "@i18n"
import FieldSelection from "@vtf-ui/FieldSelection.vue"
import { FieldRef } from "@typeful/model/Model"
import { SortController } from "@typeful/storage-vue/collection/sorting"

export default defineComponent({
  components: {FieldSelection},
  props: {
    ctrl: {type: Object as PropType<SortController>, required: true},
  },
  setup(props) {
    const i18n = useI18n();
    return {
      ...i18n,
      addSorting(field: FieldRef) {
        props.ctrl.toggleSort(field.path)
      },
    }
  },
})
</script>
