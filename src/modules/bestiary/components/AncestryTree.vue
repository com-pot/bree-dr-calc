<template>
  <div :style="treeStyles" class="ancestry-tree">
    <component :is="treeNodeComponent" :expand-levels="expandLevels" :node="rootNode" :traversal-rules="traversalRules">
      <template v-slot:default="{node}">
        <div :class="['tree-node', node.relation && 'relation-' + node.relation]" :style="getNodeStyle(node)" :data-id="node.id">
          <div v-if="node.beast" class="beast-info">
            <span>#{{ node.treeOffset }} <span class="name">{{ node.beast.general.name }}</span></span>
            <span v-if="node.beast.general.breedingStation" class="station">{{
                breedingStationName(node.beast.general.breedingStation)
              }}</span>
          </div>

          <div v-else class="beast-info">
            Záznam chybí
          </div>
        </div>

      </template>
    </component>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, shallowRef} from "vue"
import {useI18n} from "@typeful/vue-app/i18n"

import TreeNode from "./AncestryTree/TreeNodeFlat.vue"
import {TraversalRules} from "./AncestryTree/AncestryTree"
import {Beast} from "../model/Bestiary"

import BeastFamilyTree, {RelationName} from "../model/BeastFamilyTree"
import beastsStore from "../store/beastsStore"

type BeastNode = {
  id: string,
  relation: string,
  beast: Beast | null,
  treeOffset: number,
  treeLevel: number,
}


export default defineComponent({
  props: {
    ancestryTree: {type: Object as PropType<BeastFamilyTree>, required: true},
    walkRelations: {type: Array as PropType<RelationName[]>, required: true},
    expandLevels: {type: Number, default: 1},
    rootNodeRelation: {type: String, default: 'root'},
  },
  setup(props) {
    const i18n = useI18n()

    const createChildNode = (ancestryTree: BeastFamilyTree, node: BeastNode, relation: RelationName) => {
      const treeOffset = ancestryTree.treeArithmetics.getRelativeOffset(node.treeOffset, relation)
      const beast = node.beast ? ancestryTree.getBeast(node.beast.lineage[relation]) : null

      return {
        id: beast?.id || (node.id + '-' + relation),
        beast,
        treeLevel: node.treeLevel + 1,
        relation,
        treeOffset,
      }
    }

    const rules: TraversalRules<BeastNode> = {
      getChildren(node) {
        return props.walkRelations.map((relation) => createChildNode(props.ancestryTree, node, relation))
      },
    }

    const traversalRules = ref(rules)
    const rootNode = computed<BeastNode>(() => {
      const beast = props.ancestryTree.getBeastByPath()
      return {
        id: beast?.id || 'root',
        relation: props.rootNodeRelation,
        beast,
        treeLevel: 0,
        treeOffset: 0,
      }
    })

    const treeStyles = computed(() => {
      const styles: any = {
        '--display-levels': props.expandLevels + 1,
      }

      for (let i = 0; i < props.expandLevels; i++) {
        styles['--level-span-' + i] = 2 ** (props.expandLevels - i)
      }

      return styles
    })

    return {
      ...i18n,

      treeNodeComponent: shallowRef(TreeNode),

      rootNode,
      traversalRules,
      breedingStationName: beastsStore.getters.breedingStationName,

      treeStyles,
      getNodeStyle: (node: BeastNode) => {
        return '--tree-level: ' + node.treeLevel
          + '; --tree-offset: ' + node.treeOffset
          + '; --row-span: var(--level-span-' + node.treeLevel + ')'
      },
    }
  },
})
</script>

<style lang="scss">
.ancestry-tree {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(var(--display-levels), 1fr);

  .tree-node {
    grid-column: calc(var(--tree-level) + 1);
    grid-row: span var(--row-span);

    display: flex;
    flex-direction: row;

    &::before {
      content: '';
      display: block;
      width: 0.2em;
      background: var(--relation-color);
    }

    &.relation-mother {
      --relation-color: #{mix(red, white, 10%)};
    }

    &.relation-father {
      --relation-color: #{mix(blue, white, 10%)};
    }

    border: 1px solid gray;

    &:not(:first-child) {
      border-left: 0;
    }
  }

  .beast-info {
    padding: 4px;

    display: flex;
    flex-direction: column;


  }
}
</style>
