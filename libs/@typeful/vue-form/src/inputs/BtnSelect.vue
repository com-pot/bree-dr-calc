<script lang="ts" setup>
import {PropType} from "vue";

const emit = defineEmits(['update:modelValue'])

type Option = {value: string|number, label: string}
defineProps({
  modelValue: {},
  options: {type: Array as PropType<Option[]>, required: true},
})

</script>

<template>
  <div class="btn-group btn-group-select">
    <label v-for="option in options" :key="option.value"
           :class="['btn', modelValue === option.value ? 'btn-primary' : 'btn-light']">
      <input type="radio" :value="option.value"
             :checked="option.value === modelValue" @update:checked="emit('update:modelValue', option.value)"
      />
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
