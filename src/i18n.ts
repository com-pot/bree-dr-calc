import Translator from "@/modules/i18n/Translator";

const translator = new Translator()
translator.extendDictionary(require("@/modules/app/localization/app.cs_CZ.json"))
translator.extendDictionary(require("@/modules/auth/localization/auth.cs_CZ"))
translator.extendDictionary(require("@/modules/bestiary/localization/bestiary.cs_CZ.json"))
translator.extendDictionary(require("@/modules/bestiary-dachshund/localization/dachshund.cs_CZ.json"))

export const translate = translator.translate.bind(translator)

export default {
    translate,
}

export const translateMixin = {
    methods: {
        $t: translate,
    }
}
