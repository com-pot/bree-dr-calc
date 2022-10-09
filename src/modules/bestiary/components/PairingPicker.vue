<script lang="ts" setup>
import { computed, defineProps, PropType } from 'vue';
import { RefInput } from '@typeful/vue-form';
import { evaluateWrightCoefficient, filterCoveredPredecessors } from '../utils/WrightCalculation';

const props = defineProps({
  pairing: {type: Object, required: true},
  beastMultiPresence: {type: Object as PropType<ReturnType<typeof filterCoveredPredecessors<any>>>, required: true},
})

const wrightCoefficient = computed(() => {
  return evaluateWrightCoefficient(props.beastMultiPresence);
})
const wrightCoefficientPct = computed(() => {
  const wc = wrightCoefficient.value
  return wc === -1 ? -1 : wc * 100
})
</script>

<template>
  <div class="row row-pairing">
    <div class="col-md beast-selection">
      <RefInput path="mother"/>
    </div>

    <div class="text-center">
      <div :class="[
        'wright-coefficient',
          pairing.mother && 'left-ready',
          pairing.father && 'right-ready',
        ]">
        <span v-if="pairing.mother && pairing.father" class="value">
          <template v-if="wrightCoefficientPct === -1">...</template>
          <template v-else>{{ wrightCoefficientPct.toPrecision(8) }} %</template>
        </span>
        <span v-else>{{ (pairing.mother ? 1 : 0) + (pairing.father ? 1 : 0) }} / 2</span>
      </div>
    </div>

    <div class="col-md beast-selection">
      <RefInput path="father"/>
    </div>
  </div>
</template>
