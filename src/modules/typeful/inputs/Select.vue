<template>
  <select v-model="inputValue" class="form-control">
    <option v-for="option in availableOptions" :key="option[valueKey]" :value="option[valueKey]">{{
        option.label
      }}
    </option>
  </select>
</template>

<script>
import ItemLists from "@/modules/typeful/services/ItemLists"
import {inject} from "vue"

export default {
  props: {
    options: {type: Array},
    itemsSource: {type: undefined},
    domain: {type: undefined},
    createItemLabel: Function,
    createValueLabel: Function,
    valueKey: {type: String, default: 'value'},
  },

  setup() {
    const inputValue = inject('inputValue')

    return {
      inputValue,
    }
  },
  data() {

    const setItems = (items) => {
      if (this.createItemLabel) {
        items = items.map((item) => ({
          ...item,
          label: this.createItemLabel(item),
        }))
      } else if (this.createValueLabel) {
        items = items.map((item) => ({
          ...item,
          label: this.createValueLabel(item[this.valueKey])
        }))
      }

      this.availableOptions = items
    }
    const initializeItemsSource = (itemSourceName) => {
      let result = ItemLists.singleInstance.fetchItems(itemSourceName, '', this.domain)
      if (Array.isArray(result)) {
        setItems(result)
      } else if (result instanceof Promise) {
        result.then((items) => setItems(items))
      } else {
        console.error("Invalid result", result)
      }
    }

    return {
      decIn: this.$parent,
      availableOptions: [],

      initializeItemsSource,
    }
  },
  created() {
    if (this.options) {
      this.$watch('options', (options) => this.availableOptions = options, {immediate: true})
      return
    }
    if (this.itemsSource) {
      this.initializeItemsSource(this.itemsSource)
    }
  }
}
</script>
