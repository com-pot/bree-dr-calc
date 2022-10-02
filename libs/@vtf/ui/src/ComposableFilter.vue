<template>
  <section class="list-option -filter">
    <div class="section-heading">
      Filtrování
      <FieldSelection :fields="filtering.fields" :pick="addFilter" title="Přidat filtr">
        <template v-slot:field="{field}">{{ field.field.label }}</template>
      </FieldSelection>
    </div>

    <div>
      <FilterRule v-for="(filter, i) in filtering.value" :key="i" class="form-group"
                  :field="filterFields[i]" :filter-condition="filter"
                  @remove="filtering.removeFilter(i)"
                  @change:filter-type="filtering.setFilterType(i, $event)"
                  @change:args="filtering.setArgs(i, $event)"
                  @toggle-negation="filtering.toggleNegation(i)"
      />
    </div>


  </section>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue"

import {useI18n} from "@i18n"

import {useFields} from "@vtf-typeful"
import {FilterField, Filtering} from "@vtf-collection"
import FilterRule from "./ComposableFilter/FilterRule.vue"
import FieldSelection from "./FieldSelection.vue"


export default defineComponent({
  components: {
    FieldSelection,
    FilterRule,
  },
  props: {
    filtering: {type: Object as PropType<Filtering>, required: true},
  },
  setup(props) {
    const i18n = useI18n()
    const fields = useFields()

    const filterFields = computed(() => props.filtering.value
      .map((condition) => props.filtering.fields.find((f) => f.prop === condition.prop))
    )

    return {
      ...i18n,

      filterFields,
      addFilter(field: FilterField) {
        const add = (value: any) => props.filtering.addFilter(field.prop, '=', value)
        const value = fields.getDefaultValue(field.field)
        if (value instanceof Promise) {
          value.then(add)
        } else {
          add(value)
        }
      },
    }
  },
})
</script>

<style lang="scss">

.filter-rule {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  > label {
    margin-inline-end: 0.5em;

    > *:not(:first-child) {
      margin-inline-start: 0.25em;
    }

    .term {
      width: 32px;
      padding: 3px;

      display: inline-grid;
      place-content: center;
    }
  }

  .filter-input {
    width: auto;
  }
}

.new-filter-fields {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  a {
    display: inline-block;
    padding: 3px 6px;
    margin: 2px;
  }
}
</style>
