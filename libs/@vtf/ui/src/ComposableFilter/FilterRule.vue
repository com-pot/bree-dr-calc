<template>
  <div class="filter-rule">
    <label>
      <span class="badge badge-light text-danger" @click="$emit('remove')">&times;</span>
      <span>{{ (field.ui.label) }}</span>
      <span @click.prevent="$emit('toggle-negation')" class="term">{{ !filterCondition.neg ? 'je' : 'není' }}</span>

      <Tippy interactive>
        <template #content>
          <button v-for="option in availableOperators" :key="option" class="btn btn-sm btn-light"
                  @click="$emit('update:filter-type', option)">
            {{ option }}
          </button>
        </template>
        <template #default>
          <span class="term">{{ filterCondition.op }}</span>
        </template>
      </Tippy>
    </label>


    <DecInput class="filter-input" v-bind="field.schema"
       :model-value="filterCondition.args"
       @update:model-value="$emit('update:args', $event)"
    />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue"
import {Tippy} from "vue-tippy"
import {DecInput} from "@typeful/vue-form"

import {useI18n} from "@i18n"

import {FilterCondition} from "@vtf-collection"
import { FieldRef } from "@typeful/model/TypefulModel"


export default defineComponent({
  components: {
    Tippy,
    DecInput,
  },
  props: {
    filterCondition: {type: Object as PropType<FilterCondition>, required: true},
    field: {type: Object as PropType<FieldRef>, required: true},
  },
  setup(props) {
    const i18n = useI18n()
    const availableOperators = computed(() => {
      const schema = props.field.schema

      if (typeof schema.options === "string") {
        return ['=']
      }
      if (schema.type === 'text') {
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
