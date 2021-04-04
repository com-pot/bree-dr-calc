<template>
  <div class="auth-page">
    <h1>{{ $t('auth.view.AuthInfo') }}</h1>
    <p>
      Veškeré údaje jsou uloženy na vašem počítači, viz
      <router-link :to="{name: 'app.About'}">{{ $t('app.view.About') }}</router-link>
      .
      Jedná se o tyto údaje:
    </p>
    <ul>
      <li>Uživatel: {{ userName }}</li>
      <li>Celkem šelem: {{ resetSummary.beastCount }}</li>
      <li>Celkem chovatelských stanic: {{ resetSummary.breedingStations }}</li>
    </ul>

    <div class="card">
      <div class="card-body">
        <p>
          Pokud si přejete všechny údaje smazat, vyplňte <b>{{ confirmationText }}</b> do následujícího formuláře.
        </p>

        <div class="input-group">
          <DecInput v-model="confirmation" type="text"></DecInput>
          <div class="input-group-append">
            <div :class="['btn btn-danger', !deleteEnabled && 'disabled']" @click="resetData">Smazat</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {translateMixin} from "@/i18n.ts";
import DecInput from "@/modules/typeful/components/DecInput";
import {computed, ref} from "vue";
import authStore from "@/modules/auth/store/authStore.ts";
import {useRouter} from "vue-router";
import beastsStore from "@/modules/bestiary/store/beastsStore.ts";

export default {
  components: {DecInput},
  mixins: [
    translateMixin,
  ],
  setup() {
    const $router = useRouter()

    const confirmation = ref('')
    const confirmationText = ref('Smazat všechna data')
    const deleteEnabled = computed(() => confirmation.value.toLowerCase() === confirmationText.value.toLowerCase())

    const resetSummary = computed(() => ({
      beastCount: beastsStore.state.beastList.length,
      breedingStations: beastsStore.state.breedingStations.length,
    }))

    return {
      userName: authStore.state.userName,

      confirmation,
      confirmationText,
      deleteEnabled,
      resetSummary,

      resetData: () => {
        if (!deleteEnabled.value) {
          return
        }
        authStore.actions.logOut()
        beastsStore.resetUserData()
        $router.push({name: "app.Home"})
      },
    }
  },
}
</script>
