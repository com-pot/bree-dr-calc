import { App } from "vue";
import { createInputRegistry, provideInputRegistry } from "./inputRegistry";

export default {
  install(app: App) {
    const inputRegistry = createInputRegistry()
    provideInputRegistry(app, inputRegistry)
  }
}
