<template>
  <form @submit.prevent="onSubmit(modelObj)">
    <slot/>

    <div v-if="onSubmit" class="form-group">
      <button class="btn btn-primary" type="submit">Yeeee</button>
    </div>
  </form>
</template>

<script>
import {computed, provide, ref} from "vue";

export default {
  name: "DecForm",
  props: {
    modelValue: {type: Object},
    onSubmit: {type: Function},
  },
  emits: {
    'success'() {
      return true
    },
  },
  setup(props) {
    const internalModel = ref(props.modelValue ? null : {})
    const modelObj = computed(() => props.modelValue || internalModel.value)
    provide('modelObj', modelObj)

    return {
      modelObj,
    }
  },
}
</script>
