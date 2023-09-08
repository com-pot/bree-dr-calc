<script lang="ts" setup>
import {useRouter} from "vue-router"
import {useI18n} from "@typeful/vue-app/i18n"

import useModel, { provideActiveModel } from "@typeful/model-vue/useModel";
import {DecForm, RefInput} from "@typeful/vue-form"

import authStore from "@/modules/auth/store/authStore"

const $router = useRouter()
const i18n = useI18n()

provideActiveModel(useModel({
  meta: { name: 'auth.signIn' },
  schema: {
    type: "object",
    properties: {
      userName: {type: "string"},
    },
  },
}))

function submitSignInForm(values: any) {
  authStore.actions.logIn(values.userName)
  $router.push("/")
}
</script>

<template>
  <div class="sign-in">
    <div class="card">
      <div class="card-header">
        <h1>{{ i18n.t('auth.view.SignIn') }}</h1>
      </div>

      <div class="card-body">
        <DecForm :on-submit="submitSignInForm">
          <RefInput path="userName" />
        </DecForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sign-in {
  min-width: 320px;
}
</style>
