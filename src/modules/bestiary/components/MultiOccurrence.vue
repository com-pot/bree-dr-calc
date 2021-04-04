<template>
  <div class="multi-occurrence">
    <h2>Násobný výskyt šelem</h2>

    <p v-if="!beastPresenceWithEffect">Po výběru šelem se zde zobrazí vícenásobné výskyty</p>
    <p v-else-if="!beastPresenceWithEffect.length">
      Zvolení kandidáti nemají až do {{ maxCalculationLevel }}. úrovně žádné vícenásobné výskyty.
    </p>

    <template v-else>
      <div class="list">
        <MultiOccurrenceBeast v-for="(occurrence) in beastPresenceWithEffect" :key="occurrence.beast.id"
                              :beast="occurrence.beast" :occurrences="occurrence.occurrences" display-effect
        />
      </div>
    </template>

    <template v-if="beastPresenceFullyCovered && beastPresenceFullyCovered.length">
      <h3>Šelmy bez efektu - pokryté jejich předky</h3>
      <div class="list">
        <MultiOccurrenceBeast v-for="(occurrence) in beastPresenceFullyCovered" :key="occurrence.beast.id"
                              :beast="occurrence.beast" :occurrences="occurrence.occurrences"
        />
      </div>
    </template>

  </div>
</template>

<script>
import {computed} from "vue";
import MultiOccurrenceBeast from "@/modules/bestiary/components/MultiOccurrenceBeast";

export default {
  components: {MultiOccurrenceBeast},
  props: {
    occurrences: {type: Array},
    maxCalculationLevel: {type: Number, required: true},
  },
  setup(props) {
    const beastPresenceWithEffect = computed(() => {
      return props.occurrences?.filter((presence) => !presence.fullyCoveredByPredecessors);
    })
    const beastPresenceFullyCovered = computed(() => {
      return props.occurrences?.filter((presence) => presence.fullyCoveredByPredecessors);
    })

    return {
      beastPresenceWithEffect,
      beastPresenceFullyCovered,
    }
  },
}
</script>

<style lang="scss">
.multi-occurrence {
  .list {
    display: flex;
    flex-wrap: wrap;

    margin-right: -1em;

    .beast {
      margin-right: 1em;
      min-width: 320px;
    }
  }
}
</style>
