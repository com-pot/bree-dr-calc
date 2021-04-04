import TextInput from "../inputs/Text.vue"
import NumberInput from "../inputs/Number.vue"
import SelectInput from "../inputs/Select.vue"
import BtnSelectInput from "../inputs/BtnSelect.vue"
import DateInput from "../inputs/Date.vue"

const inputComponentRegistry: { [name: string]: any } = {
  text: TextInput,
  number: NumberInput,
  select: SelectInput,
  btnSelect: BtnSelectInput,
  date: DateInput,
}

export function getComponent(type: string): any {
  return inputComponentRegistry[type]
}
