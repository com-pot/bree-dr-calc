<template>
  <div class="filter-rule">
    <label>
      <span class="badge badge-light text-danger" @click="$emit('remove')">&times;</span>
      <span>{{ (field.field.label) }}</span>
      <span @click.prevent="$emit('toggle-negation')" class="term">{{ !filterCondition.neg ? 'je' : 'není' }}</span>

      <Tippy interactive>
        <template #content>
          <button v-for="option in availableOperators" :key="option" class="btn btn-sm btn-light"
                  @click="$emit('change:filter-type', option)">
            {{ option }}
          </button>
        </template>
        <template #default>
          <span class="term">{{ filterCondition.type }}</span>
        </template>
      </Tippy>
    </label>


    <DecInput class="filter-input" v-bind="field.field" :model-value="filterCondition.args" @change:model-value="$emit('change:args', $event)"/>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue"
import {Tippy} from "vue-tippy"
import {useI18n} from "@i18n"

import {FieldObj} from "@vtf-typeful"
import {FilterCondition} from "@vtf-collection"
import {DecInput} from "@vtf-form"

export default defineComponent({
  components: {
    Tippy,
    DecInput,
  },
  props: {
    filterCondition: {type: Object as PropType<FilterCondition>, required: true},
    field: {type: Object as PropType<FieldObj>, required: true},
  },
  setup(props) {
    const i18n = useI18n()
    const availableOperators = computed(() => {
      const field = props.field.field

      if (field.itemsSource) {
        return ['=']
      }
      if (field.type === 'text') {
        return ['=', 'like']
      }

      return ['=', '>', '>=', '<', '<=']
    })

    return {
      ...i18n,
      availableOperators,
    }
  },
})
</script>
