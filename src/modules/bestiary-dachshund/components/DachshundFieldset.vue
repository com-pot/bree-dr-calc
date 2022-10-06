<script lang="ts" setup>
import { RefFieldset } from "@typeful/vue-form"
import { provideActiveModel } from "@typeful/model-vue/useModel"

provideActiveModel('@com-pot/bestiary-dachshund.dachshund')

const dachshundFieldset = {
  label: "Detaily jezevčíka",

  fields: [
    {ref: ['dachshund', 'sizeVariant'], colClass: 'col-md-3'},
    {ref: ['dachshund', 'coatType'], colClass: 'col-md-3'},
    {ref: ['dachshund', 'coatPaint'], colClass: 'col-md-3'},
    {
      ref: ['dachshund', 'geneticGrades'], colClass: 'col-md-3',
      props: {disabled: true},
    },
    {
      ref: ['dachshund', 'behaviorGrades'], colClass: 'col-md-3',
      props: {disabled: true},
    },
    {
      ref: ['dachshund', 'healthGrades'], colClass: 'col-md-3',
      props: {disabled: true},
    },
    {
      ref: ['dachshund', 'bonity'], colClass: 'col-md-3',
      props: {disabled: true, appearance: 'block'},
    },
  ],
}
</script>

<template>
  <RefFieldset v-bind="dachshundFieldset"/>
</template>

