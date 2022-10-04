<script lang="ts" setup>
import {inject, Ref} from "vue"

const inputValue = inject('inputValue') as Ref<string>
</script>

<template>
  <input v-model="inputValue" class="form-control" type="text"/>
</template>

