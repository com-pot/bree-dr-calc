import { inject, isRef, provide, ref, Ref } from "vue"
import { ModelSpec } from "@typeful/model/ModelSpec";
import Model from "@typeful/model/Model";

export default function useModel(modelName: string | ModelSpec): Model {
  throw new Error(`use model '${modelName}' not implemented`)
  // return new Model()
}

const diKeyActiveModel = '@typeful/model.activeModel'
export function provideActiveModel(model: string | Model | Ref<Model>) {
  if (typeof model === "string") {
    model = useModel(model)
  }
  const modelRef = isRef(model) ? model : ref(model)
  provide(diKeyActiveModel, modelRef)
  return modelRef
}
export function useActiveModel(): Ref<Model> {
  const model = inject(diKeyActiveModel) as Ref<Model>
  if (!model) {
    console.warn("No active model provided");
  }
  return model
}

const diKeyActiveInstance = '@typeful/model.activeInstance'
export function provideModelInstance(ref: Ref) {
  provide(diKeyActiveInstance, ref)
}
export function useModelInstance<T extends object = any>(): Ref<T> {
  return inject(diKeyActiveInstance) as Ref<T>
}
