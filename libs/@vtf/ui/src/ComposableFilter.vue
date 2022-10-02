<template>
  <div class="tf-filter">
    <div class="filter-heading">
      Filtrování
      <Tippy trigger="mouseenter" interactive>
        <template #content>
          <div class="new-filter-fields">
            <a v-for="(field, i) in filtering.fields" :key="i"
               href="#" @click.prevent="addFilter(field)"
            >{{ (field.field.label) }}</a>
          </div>
        </template>

        <template #default>
          <span class="badge badge-primary" title="Přidat filtr">+</span>
        </template>
      </Tippy>
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


  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue"
import {Tippy} from "vue-tippy"
import {useI18n} from "@i18n"

import {useFields} from "@vtf-typeful"
import {FilterField, Filtering} from "@vtf-collection"
import FilterRule from "@vtf-ui/ComposableFilter/FilterRule.vue"


export default defineComponent({
  components: {
    Tippy,
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
.tf-filter {
}

.filter-rule {
  label {
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
