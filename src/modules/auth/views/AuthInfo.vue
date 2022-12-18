<template>
  <div class="auth-page">
    <h1>{{ i18n.t('auth.view.AuthInfo') }}</h1>

    <p>Právě zde máte uloženy tyto údaje:</p>
    <dl class="definitions">
      <dt>Uživatel</dt>
      <dd style="grid-column: span 3">{{ authStore.state.userName }}</dd>
      <dt>Celkem šelem</dt>
      <dd>{{ beastsStore.state.beastList.length }}</dd>
      <dt>Celkem chovatelských stanic</dt>
      <dd>{{ beastsStore.state.breedingStations.length }}</dd>
    </dl>

    <div class="card">
      <div class="card-body">
        <p>
          Pokud si přejete všechny údaje smazat, vyplňte <b>{{ confirmation.template }}</b> do následujícího formuláře.
        </p>

        <div class="input-group">
          <DecInput v-model="confirmation.value" type="string"/>
          <div class="input-group-append">
            <div :class="['btn btn-danger', !confirmation.valid && 'disabled']" @click="resetDataIfValid">Smazat</div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="mt-4">Upozornění o datech</h2>
    <p>
      Právě pracujete s <b class="text-warning">Lokálním</b> účtem. Všechny údaje jsou uloženy pouze na vašem disku a
      neukládají se nikde na internetu.<br/>
      Jelikož jsou data ukládána lokálně, máte k nim přístup přístup pouze v tomto zařízení a pouze v tomto prohlížeči.
    </p>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router"
import {useI18n} from "@typeful/vue-app/i18n"
import {DecInput} from "@typeful/vue-form"
import useConfirmation from "@typeful/vue-utils/useConfirmation"

import authStore from "../store/authStore"
import beastsStore from "@/modules/bestiary/store/beastsStore"

const $router = useRouter()
const i18n = useI18n()

const confirmation = useConfirmation({
  template: 'Smazat všechna data',
})

const resetDataIfValid = () => {
  if (!confirmation.valid) {
    return
  }

  authStore.actions.logOut()
  beastsStore.resetUserData()
  $router.push({name: "app.Home"})
}

</script>
