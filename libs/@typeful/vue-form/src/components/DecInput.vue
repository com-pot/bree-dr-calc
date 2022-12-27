<script lang="ts">
import { defineComponent, watch } from "vue";
import asyncRef from "@typeful/vue-utils/asyncRef";
import { Schema } from "@typeful/schema/Schema";
import { useCollections } from "@typeful/storage-vue/collections";
import { useI18n } from "vue-i18n";
import { compileRecipeEvalFn } from "@typeful/types/Recipe";
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
const collections = useCollections()
const i18n = useI18n()

const dependencies = asyncRef<Record<string, unknown>>(Promise.resolve({}))
const collectionRef = computed(() => {
  const options = (attrs.options || attrs.enum) as Schema['options']
  if (!options || Array.isArray(options)) {
    return null
  }

  let source: string, filter: unknown = null
  if (typeof options === 'string') {
    source = options
  } else {
    source = options.source
    filter = options.filter
  }
  const collection = collections.getCollection(source)

  return {source, collection, filter}
})

const getValue = (option: any): string | number => (typeof option === 'object' ? option.value : option)
const createLabelFn = computed(() => {
  const collection = collectionRef.value?.collection
  const createLabel = collection?.opts?.ui?.createLabel
  if (!createLabel || typeof createLabel === 'function') {
    return createLabel
  }
  if ('prefix' in createLabel) {
    return (option: any) => i18n.t(createLabel.prefix + getValue(option))
  }

  if (createLabel.type === 'template') {
    return compileRecipeEvalFn(createLabel.template)
  }

  console.warn("itemLabelTemplate value not recognized", createLabel)
  return null
})

watch(collectionRef, (ref) => {
  if (!ref) return
  const {collection, filter} = ref

  dependencies._await((async () => {
    let options = await collections.fetchItems(collection, filter as any)
    if (ref.source === 'bestiary:beast') {
      console.log({filter, options, unfiltered: await collections.fetchItems(collection)});
    }


    if (createLabelFn.value) {
      options = options.map((option: any) => ({ ...option, label: createLabelFn.value!(option) }))
    }

    return {options}
  })())
}, {immediate: true})

const componentVNode = computed(() => {
  if (!dependencies.ready) {
    return h('div', {class: 'loader'}, ['loading...'])
  }

  const entry = inputRegistry.matchInput(attrs);

  const inAttrs: any = {
    ...attrs,
    ...dependencies.value,

    inputClass: 'form-control',
    outerClass: 'form-group',
  }

  Object.assign(inAttrs, entry?.formkit)

  return h(FormKit, inAttrs, slots)
})
</script>

<template>
  <component :is="componentVNode" />
</template>
