<template>
  <div class="beast">
    <span>
      Šelma <b>{{ beast.general.name }}</b>
      <span v-if="beast.general.wright > 0"> se zatížením <span class="wright">{{ beast.general.wright }}</span></span>
      se vyskytuje na pozicích:
    </span>

    <ul>
      <li v-for="(occurrence, i) in occurrences" :key="i">
        {{ getTreeLabel(occurrence.tree) }} #{{ occurrence.treeOffset }}, úroveň {{ occurrence.level }}
      </li>
    </ul>

    <p v-if="displayEffect">
      Podíl: {{ effectPct }}% = <span v-tippy="weight">0.5<sup>{{ levelPower }}</sup></span> * <span v-tippy="wrightExpl ">{{ wrightTotal }}</span>
    </p>
  </div>
</template>

<script>
import {computed} from "vue";

export default {
  props: {
    beast: {type: Object, required: true},
    occurrences: {type: Object, required: true},
    displayEffect: {type: Boolean},
  },
  setup(props) {
    const levelPower = computed(() => props.occurrences.reduce((sum, occurrence) => sum + occurrence.level, 1))
    const weight = computed(() => 0.5 ** levelPower.value)
    const beastWright = computed(() => props.beast.general.wright || 0)
    const wrightTotal = computed(() => 1 + beastWright.value)
    const wrightExpl = computed(() => {
      return 'Základ=1' + (beastWright.value > 0 ? ' + Fx=' + beastWright.value.toPrecision(2) : '');
    })
    const effectPct = computed(() => weight.value * wrightTotal.value * 100)


    return {
      levelPower,
      weight,
      wrightTotal,
      wrightExpl,
      effectPct,
      getTreeLabel: (relation) => (relation === 'father' ? 'Otcova' : 'Matčina') + ' strana',
    }
  },
}
</script>
