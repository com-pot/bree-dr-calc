<script lang="ts" setup>
import {defineProps} from "vue"
import {DecForm, RefInput} from "@typeful/vue-form"

import useModel, { provideActiveModel } from "@typeful/model-vue/useModel"

provideActiveModel(useModel('@com-pot/bestiary.station'))

defineProps({
  station: {type: Object, required: true},
  isPersisted: {type: Boolean},
})
</script>

  <template>
  <DecForm :model-value="station">
    <div class="form-row">
      <div class="col-md-6">
        <RefInput path="name"/>
      </div>

      <div class="col-md-2 col-sm-5">
        <RefInput path="country"/>
      </div>
      <div class="col-md-4 col-sm-7">
        <RefInput path="id" :disabled="isPersisted"/>
      </div>
    </div>
  </DecForm>
</template>
