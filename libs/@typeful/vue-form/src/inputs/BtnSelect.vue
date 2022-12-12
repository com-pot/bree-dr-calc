<script lang="ts" setup>
import {computed, inject, PropType, Ref} from "vue";

type Option = {value: string|number, label: string}
const props = defineProps({
  options: {type: Array as PropType<Option[]>, required: true},
  createItemLabel: {type: Function as PropType<(opt: Option) => string>},
})
const inputValue = inject('inputValue') as Ref

const availableOptions = computed(() => {
  let options = props.options
  if (props.createItemLabel) {
    options = options.map((item) => ({...item, label: props.createItemLabel!(item)}))
  }
  return options
})
</script>

<template>
  <div class="btn-group btn-group-select">
    <label v-for="option in availableOptions" :key="option.value"
           :class="['btn', inputValue === option.value ? 'btn-primary' : 'btn-light']">
      <input v-model="inputValue" :value="option.value" type="radio"/>
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

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
