<template>
  <div class="sign-in">
    <div class="card">
      <div class="card-header">
        <h1>{{ t('auth.view.SignIn') }}</h1>
      </div>

      <div class="card-body">
        <DecForm :on-submit="onSubmit">
          <DecFormInput v-bind="decFields.userName"/>
        </DecForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router"
import {useI18n} from "@i18n"

import {DecForm, DecFormInput} from "@typeful/vue-form"

import authStore from "@/modules/auth/store/authStore"
import { FieldRef } from "@typeful/model/TypefulModel";
import { createPath } from "@typeful/model/path/pathTypes";


export default {
  components: {
    DecFormInput,
    DecForm,
  },
  setup() {
    const $router = useRouter()
    const i18n = useI18n()

    const decFields = ref({
      userName: ((): FieldRef => ({
        name: 'userName',
        path: createPath('userName'),
        schema: {type: "text"},
        ui: {
          locPrefix: 'auth.signIn.'
        },

      }))(),
    })

    return {
      ...i18n,
      decFields,
      onSubmit: (values: any) => {
        authStore.actions.logIn(values.userName)
        $router.push("/")
      },
    }
  },
}
</script>

<style lang="scss">
.sign-in {
  min-width: 320px;
}
</style>
