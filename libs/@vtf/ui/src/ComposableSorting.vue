<template>
  <section class="list-option -sorting">
    <div class="section-heading">
      Řazení
      <FieldSelection :fields="sorting.fields" :pick="addSorting">
        <template v-slot:field="{field}">{{ field.label }}</template>
      </FieldSelection>
    </div>

    <div class="sort-rule" v-for="([prop, direction], i) in sorting.value" :key="prop.strSafe">
      <div class="input-group input-group-sm">
        <span class="input-group-text">
          <span class="badge badge-light text-danger" @click="sorting.remove(i)">&times;</span>
          <span>{{ sorting.getFieldLabel(prop) }}</span>
        </span>

        <div class="input-group-append">
          <button class="btn btn-outline-primary" @click="sorting.toggleSort(prop)">{{ t('collections.sortDirection.' + direction) }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue"
import {useI18n} from "@i18n"
import {Sorting} from "@vtf-collection"
import FieldSelection from "@vtf-ui/FieldSelection.vue"
import { FieldRef } from "@typeful/model/TypefulModel"

export default defineComponent({
  components: {FieldSelection},
  props: {
    sorting: {type: Object as PropType<Sorting>, required: true},
  },
  setup(props) {
    const i18n = useI18n();
    return {
      ...i18n,
      addSorting(field: FieldRef) {
        props.sorting.toggleSort(field.path)
      },
    }
  },
})
</script>
