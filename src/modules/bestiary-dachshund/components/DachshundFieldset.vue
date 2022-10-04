<template>
  <DecFieldset class="form-row" legend="Detaily jezevčíka" model-section="dachshund">
    <div class="col-md-3">
      <DecFormInput path="sizeVariant"></DecFormInput>
    </div>
    <div class="col-md-3">
      <DecFormInput path="coatType"></DecFormInput>
    </div>
    <div class="col-md-3">
      <DecFormInput path="coatPaint"></DecFormInput>
    </div>
    <div class="col-md-3">
      <DecFormInput path="geneticGrades" disabled></DecFormInput>
    </div>
    <div class="col-md-3">
      <DecFormInput path="behaviorGrades" disabled></DecFormInput>
    </div>
    <div class="col-md-3">
      <DecFormInput path="healthGrades" disabled></DecFormInput>
    </div>
    <div class="col-md-3">
      <DecFormInput path="bonity" appearance="block" disabled></DecFormInput>
    </div>
  </DecFieldset>
</template>

<script lang="ts">
import {DecFieldset, DecFormInput} from "@typeful/vue-form"
import useModel from "@typeful/model-vue/useModel"

export default {
  components: {
    DecFieldset,
    DecFormInput,
  },
  data() {
    const model = useModel('@com-pot/bestiary-dachshund.dachshund')
  },
}
</script>
