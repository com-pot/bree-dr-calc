<template>
  <fieldset>
    <legend v-if="legend">{{ legend }}</legend>
    <slot/>
  </fieldset>
</template>

<script lang="ts" setup>
import {computed, defineProps, ComputedRef, inject, provide} from "vue";

const props = defineProps({
  legend: {type: String},
  modelValue: {type: Object},
  modelSection: {type: String},
})

const modelObj = inject<ComputedRef>('modelObj')
const provideModelObj = computed(() => {
  const obj = modelObj?.value || props.modelValue as any

  if (!obj) {
    console.error("DecFieldset does not have modelObj")
    return undefined
  }

  return props.modelSection ? obj[props.modelSection] : obj
})
provide('modelObj' , provideModelObj)
</script>
