<template>
  <DecForm :model-value="beast">
    <DecFieldset :legend="t('bestiary.beast.fieldGroup.generalInfo')" class="form-row" model-section="general">
      <div class="col-md-3">
        <DecFormInput path="gender"/>
      </div>
      <div class="col-md-4">
        <DecFormInput path="name"/>
      </div>
      <div class="col-md-5">
        <DecFormInput path="breedingStation"/>
      </div>
      <div class="col-md-3">
        <DecFormInput path="birthDay"/>
      </div>
      <div class="offset-md-6 col-md-3">
        <DecFormInput path="evidenceCode"/>
      </div>
    </DecFieldset>

    <DecFieldset :legend="t('bestiary.beast.fieldGroup.ancestry')" class="form-row" model-section="lineage">
      <div class="col-md">
        <DecFormInput path="father"/>
      </div>
      <div class="col-md">
        <DecFormInput path="mother"/>
      </div>

      <div class="col-md-3">
        <DecFormInput path="wright">
          <template #labelAction>
            <a :class="wrightDisabled && 'disabled'" href="#"
               @click.prevent="computeWright">Propočíst</a>
          </template>
        </DecFormInput>
      </div>
    </DecFieldset>

    <slot name="additionalSections"/>
  </DecForm>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue"
import {useI18n} from "@i18n"
import {DecForm, DecFieldset, DecFormInput} from "@typeful/vue-form"

import beastsStore from "@/modules/bestiary/store/beastsStore"
import useModel from "@typeful/model-vue/useModel"

export default defineComponent({
  components: {
    DecForm,
    DecFieldset,
    DecFormInput,
  },
  props: {
    beast: {type: Object, required: true},
  },
  setup(props) {
    const i18n = useI18n()

    const model = useModel('@com-pot/bestiary.beast')

    const wrightLoading = ref(false)
    const wrightDisabled = computed(() => {
      return wrightLoading.value || !props.beast.general.mother || !props.beast.general.father
    })

    return {
      ...i18n,

      wrightLoading,
      wrightDisabled,

      computeWright() {
        wrightLoading.value = true
        const {mother, father} = props.beast.general
        beastsStore.actions.computeWright(mother, father)
          .then((result) => {
            const beastGeneral = props.beast.general
            beastGeneral.wright = result
          })
        .finally(() => wrightLoading.value = false)
      },
    }
  },
}
)</script>
