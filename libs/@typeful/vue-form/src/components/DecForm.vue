<script lang="ts" setup>
import {computed, defineProps, provide, ref} from "vue"

const props = defineProps({
  modelValue: {type: Object},
  onSubmit: {type: Function,},
  submitText: {type: String},
})

const internalModel = ref(props.modelValue ? null : {})
const modelObj = computed(() => props.modelValue || internalModel.value)
provide('modelObj', modelObj)
</script>

<template>
  <form @submit.prevent="onSubmit?.(modelObj)">
    <slot/>

    <div v-if="onSubmit" class="form-group text-center">
      <button class="btn btn-primary" type="submit">{{ submitText || 'Save' }}</button>
    </div>
  </form>
</template>
