<template>
  <slot :node="node">
    Template not defined
  </slot>

  <template v-for="(childNode) in childNodes" :key="childNode.id">
    <TreeNodeFlat :expand-levels="expandLevels - 1" :node="childNode" :traversal-rules="traversalRules">
      <template #default="scope">
        <slot :node="scope.node">
          Template for child not defined
        </slot>
      </template>
    </TreeNodeFlat>
  </template>
</template>

<script lang="ts" setup>
import {computed, PropType} from "vue";
import {TraversalRules, TreeNode} from "./AncestryTree";

const props = defineProps({
  node: {type: Object as PropType<TreeNode>, required: true},
  traversalRules: {type: Object as PropType<TraversalRules>, required: true},
  expandLevels: {type: Number, default: 0},
})

const childNodes = computed<TreeNode[]>(() => {
  if (props.expandLevels <= 0) {
    return []
  }
  return props.traversalRules.getChildren(props.node)
})
</script>
