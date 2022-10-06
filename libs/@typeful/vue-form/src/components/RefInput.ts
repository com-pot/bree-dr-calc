import { useActiveModel, useModelInstance } from "@typeful/model-vue/useModel";
import { FieldRef } from "@typeful/model/Model";
import { FieldPathRaw } from "@typeful/model/path/pathTypes";
import { get, set } from "lodash";
import { computed, defineComponent, h, PropType } from "vue";
import DecInput from "./DecInput.vue";

export default defineComponent({
  props: {
    path: {type: [String, Array] as PropType<string | FieldPathRaw>},
    fieldRef: {type: Object as PropType<FieldRef>},
    modelValue: {},
  },
  setup(props, {emit, slots, attrs}) {
    const model = useActiveModel()
    const instance = useModelInstance()

    const pathRaw = computed<FieldPathRaw | undefined>(() => {
      if (!props.path) {
        return
      }
      if (Array.isArray(props.path)) {
        return props.path
      }
      if (typeof props.path === 'string') {
        return props.path.split('.')
      }
      console.warn("Unknown path prop", props.path);
    })
    const fieldRef = computed(() => {
      if (props.fieldRef) {
        return props.fieldRef
      }
      if (pathRaw.value) {
        return model.value.locate().field(pathRaw.value)
      }
    })

    const internalValue = typeof props.modelValue === "undefined"
     ? computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
     })
     : computed({
      get: () => {
        const i = instance?.value
        const fRef = fieldRef.value
        if (!i || !fRef) {
          console.warn("Invalid state for RefInput", {i, fRef});
          return undefined
        }
        if (!fRef.name) {
          console.warn("FieldRef got unfound field", fRef);
          return undefined
        }

        return get(i, fRef.path)
      },
      set: (value) => {
        const i = instance?.value
        const fRef = fieldRef.value
        if (!i || !fRef) {
          return console.warn("Invalid state for RefInput", {i, fRef});
        }
        if (!fRef.name) {
          return console.warn("FieldRef got unfound field", fRef);
        }

        set(i, fRef.path, value)
      }
     })

     return () => {
      const fRef = fieldRef.value
      if (!fRef?.name) {
        console.warn("Field not found at", fRef?.path);
        return
      }

      const slottedChildren = Object.entries(slots).map(([name, slot]) => {
        return h(() => slot, {slot: name})
      })


      h(DecInput, {
        ...fRef.schema,

        modelValue: internalValue.value,
        'onUpdate:modelValue': (value: any) => internalValue.value = value,


        ...fRef.ui,
        ...attrs,

        name: fRef.name,
      }, slottedChildren)
     }
  },
})
