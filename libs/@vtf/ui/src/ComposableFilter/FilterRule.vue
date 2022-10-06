<script lang="ts" setup >
import {computed, defineProps, PropType} from "vue"
import {Tippy} from "vue-tippy"

import {DecInput} from "@typeful/vue-form"
import {FilterCondition} from "@vtf-collection"
import { FieldRef } from "@typeful/model/Model"

const props = defineProps({
  filterCondition: {type: Object as PropType<FilterCondition>, required: true},
  field: {type: Object as PropType<FieldRef>, required: true},
})

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
</script>

<template>
  <div class="filter-rule">
    <label>
      <span class="badge badge-light text-danger" @click="$emit('remove')">&times;</span>
      <span>{{ (field.ui?.label) }}</span>
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
       :model-value="filterCondition.args?.[0] ?? null"
       @update:model-value="$emit('update:args', [$event])"
    />
  </div>
</template>
