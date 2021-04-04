<template>
  <div class="sign-in">
    <div class="card">
      <div class="card-header">
        <h1>{{ $t('auth.view.SignIn') }}</h1>
      </div>

      <div class="card-body">
        <DecForm :on-submit="onSubmit">
          <DecFormInput v-bind="decFields.userName"/>
        </DecForm>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import {useRouter} from "vue-router"

import DecForm from "@/modules/typeful/components/DecForm.vue"
import {getFields} from "@/modules/typeful/services/FormsService"
import {translateMixin} from "@/i18n.ts"
import DecFormInput from "@/modules/typeful/components/DecFormInput.vue"
import authStore from "@/modules/auth/store/authStore.ts"


export default {
  mixins: [
    translateMixin,
  ],
  components: {
    DecFormInput,
    DecForm,
  },
  setup() {
    const $router = useRouter()

    const decFields = ref(getFields({
      userName: {type: "text"},
    }, {
      createFieldLabel: 'auth.signIn.'
    }))

    return {
      decFields,
      onSubmit: (values) => {
        authStore.actions.logIn(values.userName)
        $router.push("/")
      },
    }
  },
}
</script>
