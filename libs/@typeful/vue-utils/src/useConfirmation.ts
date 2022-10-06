import { computed, reactive, Ref } from "vue"

type ConfirmationOptions = {
  template: string | Ref<string>,
}

type Confirmation = {
  template: string,
  value: string,

  readonly valid: boolean,
}

export default function useConfirmation(opts: ConfirmationOptions) {
  const confirmation: Confirmation = reactive({
    template: opts.template,
    value: '',

    valid: computed<boolean>(() => {
      return confirmation.value.toLowerCase() === confirmation.template.toLowerCase()
    })
  })

  return confirmation
}
