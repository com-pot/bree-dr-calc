<template>
  <div class="beast-pairing">
    <h1>{{ $t('bestiary.view.Pairing') }}</h1>
    <div class="row row-pairing">
      <div class="col-md beast-selection">
        <DecFormInput v-model="pairing.mother" v-bind="pairingFields.mother"/>
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
        <DecFormInput v-model="pairing.father" v-bind="pairingFields.father"/>
      </div>
    </div>

    <MultiOccurrence :max-calculation-level="maxCalculationLevel" :occurrences="beastMultiPresence"/>

    <div class="row mt-2">
      <div class="col-md-6">
        <DecFormInput v-model="pairing.maxGenerations" v-bind="pairingFields.maxGenerations"/>
      </div>
      <div class="col-md-6">
        <DecFormInput v-model="pairing.walkOrder" v-bind="pairingFields.walkOrder"
                      @change:model-value="pairing.walkOrder = $event"/>
      </div>
    </div>


    <div class="row">
      <div class="col-12">
        <h2>Matka - rodokmen</h2>
        <AncestryTree v-if="ancestorTrees.mother" :ancestry-tree="ancestorTrees.mother"
                      :expand-levels="pairing.maxGenerations" :walk-relations="walkRelations"
                      root-node-relation="mother"/>
      </div>

      <div class="col-12">
        <h2>Otec - rodokmen</h2>
        <AncestryTree v-if="ancestorTrees.father" :ancestry-tree="ancestorTrees.father"
                      :expand-levels="pairing.maxGenerations" :walk-relations="walkRelations"
                      root-node-relation="father"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, reactive, watch} from "vue";
import beastSchema from "../typeful/beast.schema.json"
import {getFields} from "@/modules/typeful/services/FormsService";
import DecFormInput from "@/modules/typeful/components/DecFormInput.vue";

import * as beastStore from "../store/beastsStore"
import BeastFamilyTree from "../model/BeastFamilyTree";
import * as WrightCalculation from "@/modules/bestiary/utils/WrightCalculation";
import {Beast} from "@/modules/bestiary/model/Bestiary";

import AncestryTree from "@/modules/bestiary/components/AncestryTree.vue";
import {translateMixin} from "@/i18n";
import MultiOccurrence from "@/modules/bestiary/components/MultiOccurrence.vue";

export default {
  mixins: [
    translateMixin,
  ],
  components: {
    MultiOccurrence,
    AncestryTree,
    DecFormInput,
  },
  setup() {
    const maxCalculationLevel = 4

    const pairingFields = getFields({
      maxGenerations: {
        type: "number",
        min: 1,
        max: maxCalculationLevel,
        step: 1,
        label: 'bestiary.pairing.field.maxGenerations'
      },
      mother: beastSchema.lineage.schema.mother,
      father: beastSchema.lineage.schema.father,
      walkOrder: {
        type: "btnSelect",
        options: [
          {value: 'father,mother', label: 'Otec, Matka'},
          {value: 'mother,father', label: 'Matka, Otec'},
          {value: 'father', label: 'Otec'},
          {value: 'mother', label: 'Matka'},
        ],
        label: 'bestiary.pairing.field.walkOrder'
      }
    }, {
      createFieldLabel: 'bestiary.beast.field.',
    })

    const pairing = reactive({
      maxGenerations: 4,
      walkOrder: 'father,mother',
      mother: null as string | null,
      father: null as string | null,
    })

    const ancestorTrees = reactive({
      mother: null as BeastFamilyTree | null,
      father: null as BeastFamilyTree | null,
    })

    watch(() => pairing.mother, (m) => {
      ancestorTrees.mother = null
      if (m) {
        beastStore.actions.loadAncestors(m, 'raw', 4)
          .then((tree) => ancestorTrees.mother = tree)
          .catch((err) => console.error("Failed to load ancestor tree for father", err))
      }
    })

    watch(() => pairing.father, (f) => {
      ancestorTrees.father = null
      if (f) {
        beastStore.actions.loadAncestors(f, 'raw', 4)
          .then((tree) => (ancestorTrees.father = tree))
          .catch((err) => console.error("Failed to load ancestor tree for father", err))
      }
    })
    const walkRelations = computed(() => pairing.walkOrder.split(','))

    const beastMultiPresence = computed(() => {
      const trees = ancestorTrees as unknown as { [relation: string]: BeastFamilyTree }
      const presence = WrightCalculation.calculateSharedPresence(trees)
      if (!presence) {
        return null
      }

      const multiOccurringBeasts = WrightCalculation.aggregateMultiOccurrence(presence, getBeast)

      return WrightCalculation.filterCoveredPredecessors<Beast>(multiOccurringBeasts, trees)
    })
    const wrightCoefficient = computed(() => {
      if (!beastMultiPresence.value) {
        return -1
      }
      return WrightCalculation.evaluateWrightCoefficient(beastMultiPresence.value);
    })
    const wrightCoefficientPct = computed(() => {
      const wc = wrightCoefficient.value
      return wc === -1 ? -1 : wc * 100
    })

    const getBeast = (id: string): Beast => {
      const beast = ancestorTrees.mother?.getBeast(id) || ancestorTrees.father?.getBeast(id)
      if (!beast) {
        throw new Error("Beast not found " + beast)
      }
      return beast
    }

    return {
      // Inputs
      maxCalculationLevel,
      pairingFields,
      pairing,

      // Calculation results
      wrightCoefficientPct,
      beastMultiPresence,

      // Tree visualisation
      ancestorTrees,
      walkRelations,
    }
  },
}
</script>

<style lang="scss">
.row-pairing {
  align-items: center;
}

.wright-coefficient {
  margin: 0 auto;

  width: 200px;
  height: 80px;
  display: grid;
  place-items: center;

  font-size: 16pt;
  font-weight: bold;

  border: transparent 6px dotted;
  background: #eee;
  border-radius: 12px;
  transition: border 0.3s ease;

  &.left-ready {
    border-left-color: #AED581;
  }

  &.right-ready {
    border-right-color: #AED581;
  }

  &.left-ready.right-ready {
    border-color: #AED581;
  }
}

</style>
