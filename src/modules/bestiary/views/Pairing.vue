<script lang="ts" setup>
import {computed, reactive, watch} from "vue"
import {RefInput, DecInput} from "@typeful/vue-form"
import {useI18n} from "@typeful/vue-app/i18n"
import {useTabs} from "@typeful/vue-app/components/tabs"

import * as beastStore from "../store/beastsStore"
import BeastFamilyTree, { RelationName } from "../model/BeastFamilyTree"
import * as WrightCalculation from "../utils/WrightCalculation";
import {Beast} from "../model/Bestiary";

import AncestryTree from "../components/AncestryTree.vue";
import MultiOccurrence from "../components/MultiOccurrence.vue";
import useModel, { provideActiveModel, provideModelInstance } from "@typeful/model-vue/useModel"
import PairingPicker from "../components/PairingPicker.vue"


const i18n = useI18n()
const maxCalculationLevel: number = import.meta.env.MAX_CALCULATION_LEVEL

const beastModel = useModel('@com-pot/bestiary.Beast')

const model = provideActiveModel(useModel({
  meta: { name: "bestiary.pairing" },
  schema: {
    type: "object",
    properties: {
      maxGenerations: {
        type: "number",
        min: 1, max: maxCalculationLevel, step: 1,
        default: maxCalculationLevel,
      },

      mother: beastModel.locate().field(['lineage', 'mother'], 'null')?.schema!,
      father: beastModel.locate().field(['lineage', 'father'], 'null')?.schema!,

      walkOrder: {
        type: "string", appearance: "buttons", default: 'father,mother',
        options: [
          {value: 'father,mother', label: 'Otec, Matka'},
          {value: 'mother,father', label: 'Matka, Otec'},
          {value: 'father', label: 'Otec'},
          {value: 'mother', label: 'Matka'},
        ],
      },
    },
  }
}))

const pairing = reactive(model.value.setDefaults())
if (!pairing.walkOrder) {
  console.warn("Walk order not initialized");
}
console.log(pairing);

provideModelInstance(pairing)

const ancestorTrees = reactive({
  mother: null as BeastFamilyTree | null,
  father: null as BeastFamilyTree | null,
})

watch(() => pairing.mother, (m) => {
  ancestorTrees.mother = null
  if (m) {
    beastStore.actions.loadAncestors(m, 'raw', 4)
      .then((tree) => ancestorTrees.mother = tree)
      .catch((err) => console.error("Failed to load ancestor tree for mother", err))
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
const walkRelations = computed<RelationName[]>(() => pairing.walkOrder.split(','))

const beastMultiPresence = computed(() => {
  const trees = ancestorTrees as unknown as { [relation: string]: BeastFamilyTree }
  const presence = WrightCalculation.calculateSharedPresence(trees)
  if (!presence) {
    return []
  }

  const multiOccurringBeasts = WrightCalculation.aggregateMultiOccurrence(presence, getBeast)

  return WrightCalculation.filterCoveredPredecessors(multiOccurringBeasts, trees)
})

const getBeast = (id: string): Beast => {
  const beast = ancestorTrees.mother?.getBeast(id) || ancestorTrees.father?.getBeast(id)
  if (!beast) {
    throw new Error("Beast not found " + beast)
  }
  return beast
}

const visualisationTabs = useTabs([
  {name: 'explanation'},
  {name: 'lineage'},
])

</script>

  <template>
  <div class="beast-pairing">
    <h1>{{ i18n.t('bestiary.view.Pairing') }}</h1>

    <p>
      Párování se počítá pro zvolené šelmy pro jejich předky až do {{ maxCalculationLevel }}. generace. Po zvolení
      šelem se vypočte Wrightův Koeficient a ve spodní části stránky bude možné procházet podrobnosti párování.
    </p>

    <PairingPicker
      :pairing="pairing"
      :beast-multi-presence="beastMultiPresence"
    />

    <div>
      <RefInput path="maxGenerations"/>
      <DecInput type="number" name="maxGenerations_dec" v-model="pairing.maxGenerations"/>
    </div>

    <div class="card mt-4">
      <div class="card-header">
        <h2>Detaily párování</h2>
        <p>
          Všechny zohledněné šelmy náleží do jednoho z rodokmentů. Každý z těchto rodokmenů se skládá z jedinečných pozic
          označených číselně. V těcho pozicích se vyskytují předchůdci zvolených šelem.<br/>
          Například pozice #2 náleží matce zvolené šelmy a pozice #7 náleží otci otcova otce.
        </p>

        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item" v-for="tab in visualisationTabs.tabs" :key="tab.name">
            <a href="#" :class="['nav-link', visualisationTabs.value === tab.name && 'active']"
               @click.prevent="visualisationTabs.value = tab.name">{{ i18n.t('bestiary.pairing.tab.' + tab.name) }}</a>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <template v-if="visualisationTabs.value === 'explanation'">
          <MultiOccurrence :max-calculation-level="maxCalculationLevel" :occurrences="beastMultiPresence"/>
        </template>
        <template v-else-if="visualisationTabs.value === 'lineage'">
          <div class="row">
            <div class="col-md-6">
              <RefInput path="maxGenerations"/>
              <DecInput type="number" name="maxGenerations_dec" v-model="pairing.maxGenerations"/>
            </div>
            <div class="col-md-6">
              <RefInput path="walkOrder"/>
            </div>
          </div>

          <h3>Matčin rodokmen</h3>
          <AncestryTree v-if="ancestorTrees.mother" :ancestry-tree="ancestorTrees.mother"
                        :expand-levels="pairing.maxGenerations" :walk-relations="walkRelations"
                        root-node-relation="mother"/>

          <h3>Otcův rodokmen</h3>
          <AncestryTree v-if="ancestorTrees.father" :ancestry-tree="ancestorTrees.father"
                        :expand-levels="pairing.maxGenerations" :walk-relations="walkRelations"
                        root-node-relation="father"/>
        </template>
      </div>
    </div>
  </div>
</template>

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
