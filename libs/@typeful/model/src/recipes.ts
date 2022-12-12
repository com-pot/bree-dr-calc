import { useI18n } from "vue-i18n";

export function useRenderer() {
  const i18n = useI18n()

  return {
    stringify(val: TextRecipe): string | null {
      if (typeof val === 'object' && val.$t) {
        return i18n.t(val.$t)
      }
      if (typeof val === 'string') {
        return val
      }

      console.warn("Unable to stringify", val);

      return null
    },
  }
}

export type TextRecipe = string | {$t: string}
