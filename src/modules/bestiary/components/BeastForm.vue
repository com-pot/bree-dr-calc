<script lang="ts" setup>
  import {computed, h} from "vue"
  import {useI18n} from "@typeful/vue-app/i18n"
  import {DecForm} from "@typeful/vue-form"

  import beastsStore from "@/modules/bestiary/store/beastsStore"
  import { provideActiveModel } from "@typeful/model-vue/useModel"
  import asyncRef from "@typeful/vue-utils/asyncRef"

  const props = defineProps({
    beast: {type: Object, required: true},
  })

  const i18n = useI18n()
  const wrightCalc = asyncRef()

  provideActiveModel('@com-pot/bestiary.beast')

  const generalFieldset = {
    name: 'general', locPrefix: 'bestiary.beast.fieldGroup.',

    fields: [
      {ref: ['general', 'gender'], colClass: 'col-md-3'},
      {ref: ['general', 'name'], colClass: 'col-md-4'},
      {ref: ['general', 'breedingStation'], colClass: 'col-md-5'},
      {ref: ['general', 'birthDay'], colClass: 'col-md-3'},
      {ref: ['general', 'evidenceCode'], colClass: 'offset-md-6 col-md-3'},
    ],
  }

  const lineageFieldset = {
    name: 'lineage', locPrefix: 'bestiary.beast.fieldGroup.',

    fields: [
      {ref: ['lineage', 'father'], colClass: 'col-md'},
      {ref: ['lineage', 'mother'], colClass: 'col-md'},
      {
        colClass: 'col-md-3',
        ref: {
          path: ['lineage', 'wright'],
          ui: {
            labelAction: () => h('a', {
              class: wrightDisabled && 'disabled',
              href: '#',
              onClickPrevent: computeWright,
            }, [i18n.t('bestiary.lienage.computeWright')])
          },
        },
      },
    ],
  }

  const wrightDisabled = computed(() => {
    return !wrightCalc.ready || !props.beast.general.mother || !props.beast.general.father
  })
  function computeWright() {
    if (wrightDisabled) {
      return
    }

    const {mother, father} = props.beast.general
    const computeDone = beastsStore.actions.computeWright(mother, father)
      .then((result) => props.beast.general.wright = result)

    wrightCalc._await(computeDone)
  }
  </script>

  <template>
  <DecForm :model-value="beast">
    <RefFieldset v-bind="generalFieldset"/>
    <RefFieldset v-bind="lineageFieldset"/>
    <slot name="additionalSections"/>
  </DecForm>
</template>

