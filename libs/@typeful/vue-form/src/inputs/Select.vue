<script lang="ts">
import {computed, defineComponent, ref, PropType, watch} from "vue"

import { OptionsObj } from "@typeful/schema/Schema"
import { compileRecipeEvalFn } from "@typeful/types/Recipe"
import { FieldRef } from "@typeful/model/Model"
import { FilteringController } from "@typeful/storage-vue/collection/filter"
import { useCollections } from "@typeful/storage-vue/collections"

export default defineComponent({
  props: {
    options: {type: [String, Array, Object] as PropType<string | any[] | OptionsObj>},
    valueKey: {type: String, default: 'value'},
    type: {type: String},

    ui: {type: Object as PropType<FieldRef['ui']>},
  },

  setup(props) {
    const collections = useCollections()

    const availableOptions = ref([] as any[])

    const setItems = (items: any[]) => {
      const cLabel = createItemLabel.value
      if (cLabel) {
        items = items.map((item) => ({...item, label: cLabel(item)}))
      }

      availableOptions.value = items
    }

    const initializeItemsSource = async (itemSourceName: string, filter?: FilteringController['value']) => {
      let result = await collections.fetchItems(itemSourceName, '', filter)
      setItems(result)
    }

    if (Array.isArray(props.options)) {
      watch(() => props.options as {}[], (options) => setItems(options || []), {immediate: true})
    } else if (typeof props.options === "string") {
      initializeItemsSource(props.options)
    } else if (props.options && typeof props.options === "object"){
      initializeItemsSource(props.options.source, props.options.filter)
    } else {
      console.warn("Unknown items source")
    }


    return {
      availableOptions,
    }
  },
})
</script>

<template>
  <select class="form-control">
    <option v-for="option in availableOptions" :key="option[valueKey]" :value="option[valueKey]">{{
        option.label
      }}
    </option>
  </select>
</template>
