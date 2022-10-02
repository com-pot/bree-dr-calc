<template>
  <div class="btn-group btn-group-select">
    <label v-for="option in availableOptions" :key="option.value"
           :class="['btn', inputValue === option.value ? 'btn-primary' : 'btn-light']">
      <input v-model="inputValue" :value="option.value" type="radio"/>
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

<script>
import {computed, inject} from "vue";

export default {
  props: {
    options: {type: Array, required: true},
    createItemLabel: {type: Function},
  },
  setup(props) {
    const availableOptions = computed(() => {
      let options = props.options
      if (props.createItemLabel) {
        options = options.map((item) => ({...item, label: props.createItemLabel(item)}))
      }
      return options
    })
    return {
      inputValue: inject('inputValue'),
      availableOptions,
    }
  },
}
</script>

<style lang="scss">
.btn-group-select {
  input[type=radio], input[type=checkbox] {
    display: none;
  }
  > label {
    margin-bottom: initial;
  }
}
</style>
