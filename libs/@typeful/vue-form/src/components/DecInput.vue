<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  inheritAttrs: false,
})
</script>

<script lang="ts" setup>
import {computed, h, useAttrs, useSlots} from "vue"
import { FormKit } from "@formkit/vue"
import { useInputRegistry } from "../inputRegistry"

defineProps({
  labelAction: Function,
})

const attrs = useAttrs()
const slots = useSlots()

const inputRegistry = useInputRegistry()

const componentVNode = computed(() => {
  const entry = inputRegistry.matchInput(attrs);

  const inAttrs: any = {
    ...attrs,
    inputClass: 'form-control',
    outerClass: 'form-group',
  }

  if (entry && entry.component) {
    return h(entry.component, inAttrs, slots)
  }
  Object.assign(inAttrs, entry?.formkit)

  return h(FormKit, inAttrs)
})
</script>

<template>
  <component :is="componentVNode" />
</template>
