<template>
  <DecForm :model-value="station">
    <div class="form-row">
      <div class="col-md-6">
        <DecFormInput path="name"/>
      </div>
      <div class="col-md-2 col-sm-5">
        <DecFormInput path="country"/>
      </div>
      <div class="col-md-4 col-sm-7">
        <DecFormInput path="id" :disabled="isPersisted"/>
      </div>
    </div>
  </DecForm>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import {DecForm, DecFormInput} from "@typeful/vue-form"

import useModel from "@typeful/model-vue/useModel"

export default defineComponent({
  components: {
    DecFormInput,
    DecForm,
  },
  props: {
    station: {type: Object, required: true},
    isPersisted: {type: Boolean},
  },
  setup() {
    const model = useModel('@com-pot/bestiary.station')
  },
})
</script>
