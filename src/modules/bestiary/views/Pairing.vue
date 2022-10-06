<script lang="ts" setup>
import {computed, reactive, ref, watch} from "vue"
import {RefInput} from "@typeful/vue-form"
import {useI18n} from "@i18n"

import * as beastStore from "../store/beastsStore"
import BeastFamilyTree, { RelationName } from "../model/BeastFamilyTree"
import * as WrightCalculation from "@/modules/bestiary/utils/WrightCalculation";
import {Beast} from "@/modules/bestiary/model/Bestiary";

import AncestryTree from "@/modules/bestiary/components/AncestryTree.vue";
import MultiOccurrence from "@/modules/bestiary/components/MultiOccurrence.vue";
import useModel, { provideActiveModel } from "@typeful/model-vue/useModel"
import PairingPicker from "../components/PairingPicker.vue"


const i18n = useI18n()
const maxCalculationLevel = 4

const pairingModel = useModel({
  meta: { name: "bestiary.pairing" },
  schema: {
    type: "object",
    properties: {
      maxGenerations: {
        type: "number",
        min: 1, max: maxCalculationLevel, step: 1,
        default: maxCalculationLevel,
      },
      mother: { $ref: '@com-pot/bestiary.beast', path: ['lineage', 'mother'] },
      father: { $ref: '@com-pot/bestiary.beast', path: ['lineage', 'father'] },
      walkOrder: {
        type: "string", appearance: "btn-group", default: 'father, mother',
        options: [
          {value: 'father,mother', label: 'Otec, Matka'},
          {value: 'mother,father', label: 'Matka, Otec'},
          {value: 'father', label: 'Otec'},
          {value: 'mother', label: 'Matka'},
        ],
      },
    },
  }
})
const model = provideActiveModel(pairingModel)

const pairing = reactive(model.value.setDefaults())

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

const visualisationTabs = [
  {name: 'explanation'},
  {name: 'lineage'},
]
const activeTab = ref('explanation')

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

    <div class="card mt-4">
      <div class="card-header">
        <h2>Detaily párování</h2>
        <p>
          Všechny zohledněné šelmy náleží do jednoho z rodokmentů. Každý z těchto rodokmenů se skládá z jedinečných pozic
          označených číselně. V těcho pozicích se vyskytují předchůdci zvolených šelem.<br/>
          Například pozice #2 náleží matce zvolené šelmy a pozice #7 náleží otci otcova otce.
        </p>

        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item" v-for="tab in visualisationTabs" :key="tab.name">
            <a href="#" :class="['nav-link', activeTab === tab.name && 'active']"
               @click.prevent="activeTab = tab.name">{{ i18n.t('bestiary.pairing.tab.' + tab.name) }}</a>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <template v-if="activeTab === 'explanation'">
          <MultiOccurrence :max-calculation-level="maxCalculationLevel" :occurrences="beastMultiPresence"/>
        </template>
        <template v-else-if="activeTab === 'lineage'">
          <div class="row">
            <div class="col-md-6">
              <RefInput path="maxGenerations"/>
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
