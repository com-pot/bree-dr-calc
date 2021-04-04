<template>
  <DecForm :model-value="beast">
    <DecFieldset :legend="$t('bestiary.beast.fieldGroup.generalInfo')" class="form-row" model-section="general">
      <div class="col-md-3">
        <DecFormInput v-bind="generalFields.gender"/>
      </div>
      <div class="col-md-4">
        <DecFormInput v-bind="generalFields.name"/>
      </div>
      <div class="col-md-5">
        <DecFormInput v-bind="generalFields.breedingStation"/>
      </div>
      <div class="col-md-3">
        <DecFormInput v-bind="generalFields.birthDay"/>
      </div>
      <div class="offset-md-6"></div>
      <div class="col-md-3">
        <DecFormInput v-bind="generalFields.evidenceCode"/>
      </div>
    </DecFieldset>

    <DecFieldset :legend="$t('bestiary.beast.fieldGroup.ancestry')" class="form-row" model-section="lineage">
      <div class="col-md">
        <DecFormInput v-bind="lineageFields.father"/>
      </div>
      <div class="col-md">
        <DecFormInput v-bind="lineageFields.mother"/>
      </div>
      <div class="col-md-3">

        <DecFormInput v-bind="lineageFields.wright">
          <template v-slot:labelAction>
            <a :class="wrightDisabled && 'disabled'" href="#"
               @click.prevent="computeWright">Propočíst</a>
          </template>
        </DecFormInput>

      </div>
    </DecFieldset>
    <slot name="additionalSections"/>
  </DecForm>
</template>

<script>
import DecFieldset from "@/modules/typeful/components/DecFieldset"
import {getFields} from "@/modules/typeful/services/FormsService"
import DecFormInput from "@/modules/typeful/components/DecFormInput"
import DecForm from "@/modules/typeful/components/DecForm"
import beastSchema from "@/modules/bestiary/typeful/beast.schema.json"
import {translateMixin} from "@/i18n"
import beastsStore from "@/modules/bestiary/store/beastsStore"
import {computed, ref} from "vue";

export default {
  mixins: [
    translateMixin,
  ],
  components: {
    DecForm,
    DecFieldset,
    DecFormInput,
  },
  props: {
    beast: {type: Object, required: true},
  },
  setup(props) {
    const generalFields = getFields(beastSchema.general.schema, {
      createFieldLabel: 'bestiary.beast.general.',
    })
    const lineageFields = getFields(beastSchema.lineage.schema, {
      createFieldLabel: 'bestiary.beast.lineage.',
    })

    const wrightLoading = ref(false)
    const wrightDisabled = computed(() => {
      return wrightLoading.value || !props.beast.general.mother || !props.beast.general.father
    })

    return {
      generalFields,
      lineageFields,

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
</script>
