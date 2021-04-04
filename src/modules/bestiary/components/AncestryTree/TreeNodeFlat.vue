<template>
  <slot :node="node">
    Template not defined
  </slot>

  <template v-for="(childNode, i) in childNodes" :key="i">
    <TreeNode :expand-levels="expandLevels - 1" :node="childNode" :traversal-rules="traversalRules">
      <template v-slot:default="scope">
        <slot :node="scope.node">
          Template for child not defined
        </slot>
      </template>
    </TreeNode>
  </template>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {TraversalRules} from "@/modules/bestiary/components/AncestryTree/AncestryTree";

export default defineComponent({
  name: 'TreeNode',
  props: {
    node: {type: Object, required: true},
    traversalRules: {type: Object as PropType<TraversalRules>, required: true},
    expandLevels: {type: Number, default: 0},
  },
  setup(props) {
    const childNodes = computed(() => {
      if (props.expandLevels <= 0) {
        return []
      }
      return props.traversalRules.getChildren(props.node)
    })

    return {
      childNodes,
    }
  },
})
</script>
