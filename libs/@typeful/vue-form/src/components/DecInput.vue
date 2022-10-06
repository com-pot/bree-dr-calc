<script lang="ts" setup>
import {computed, defineEmit, defineProps, inject, ComputedRef, provide, useAttrs} from "vue"
import {ModelObj} from "./types/ModelObj"
import { useInputRegistry } from "../inputRegistry"
import { get } from "lodash"

const emit = defineEmit({
  "update:modelValue": (value: any) => value !== undefined,
})
const props = defineProps({
  type: {type: String, default: 'text'},
  modelValue: {type: undefined},

  labelAction: Function,
})

const attrs = useAttrs()

const inputRegistry = useInputRegistry()

const modelObj = props.modelValue !== undefined ? null : inject<ComputedRef<ModelObj>>('modelObj')
const name = attrs.name as string

const internalValue = computed({
  get() {
    if (modelObj?.value) {
      return get(modelObj.value, )
      return modelObj.value[name]
    }

    return props.modelValue
  },
  set(value) {
    if (modelObj?.value) {
      modelObj.value[name] = value
    } else {
      emit("update:modelValue", value)
    }
  },
})

provide('inputValue', internalValue)

const component = computed(() => {
  const component = inputRegistry.matchInput(attrs);
  if (!component) {
    console.warn("Unknown field ", props.type, attrs)
  }

  return component
})
</script>

<template>
  <div class="form-group dc-fi">
    <label>
      <span>{{ $attrs.label }}</span>
      <slot name="labelAction">
        <component v-if="labelAction" :is="labelAction"/>
      </slot>
    </label>

    <component v-if="component" :is="component" v-bind="attrs">
      <template v-for="(_, name) in $slots" v-slot:[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </component>

    <span v-else>
      <span>[path={{ attrs.name }}]</span>: <span>{{ internalValue }}</span>
    </span>
  </div>
</template>
