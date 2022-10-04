<script lang="ts" setup>
import {computed, inject, Ref} from "vue"

const inputValue = inject('inputValue') as Ref

const internalValue = computed({
  get() {
    return inputValue.value
  },
  set(value) {
    console.log("Date set value", value);

    inputValue.value = value
  }
})
</script>

<template>
  <input v-model="internalValue" class="form-control" type="date"/>
</template>

