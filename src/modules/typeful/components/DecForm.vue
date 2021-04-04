<template>
  <form @submit.prevent="onSubmit(modelObj)">
    <slot/>

    <div v-if="onSubmit" class="form-group text-center">
      <button class="btn btn-primary" type="submit">{{ submitText || $t('app.generic.save') }}</button>
    </div>
  </form>
</template>

<script>
import {computed, provide, ref} from "vue";
import {translateMixin} from "@/i18n";

export default {
  name: "DecForm",
  mixins: [
    translateMixin,
  ],
  props: {
    modelValue: {type: Object},
    onSubmit: {type: Function},
    submitText: {type: String},
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
