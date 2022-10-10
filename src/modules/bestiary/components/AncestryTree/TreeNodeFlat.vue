<template>
  <slot :node="node">
    Template not defined
  </slot>

  <template v-for="(childNode) in childNodes" :key="i">
    <TreeNode :expand-levels="expandLevels - 1" :node="childNode" :traversal-rules="traversalRules">
      <template v-slot:default="scope">
        <slot :node="scope.node">
          Template for child not defined
        </slot>
      </template>
    </TreeNode>
  </template>
</template>

<script lang="ts" setup>
import {computed, PropType} from "vue";
import {TraversalRules} from "./AncestryTree";

const props = defineProps({
  node: {type: Object, required: true},
  traversalRules: {type: Object as PropType<TraversalRules>, required: true},
  expandLevels: {type: Number, default: 0},
})

const childNodes = computed(() => {
  if (props.expandLevels <= 0) {
    return []
  }
  return props.traversalRules.getChildren(props.node)
})
</script>
