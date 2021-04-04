<template>
  <div class="home">
    <template v-if="!userAuthenticated">
      <p>
        Vítejte v aplikaci {{ appName }} - aplikaci poskytující základní správu vašich šelem a možnosti plánování
        připouštění.
        Více se můžete dočíst na stránce
        <router-link :to="{name: 'app.About'}">{{ $t('app.view.About') }}</router-link>
        .
      </p>
      <p>
        Aktuálně nemáte uložena žádná data. Můžete se
        <router-link :to="{name: 'auth.SignIn'}">přihlásit</router-link>
        anebo
        vyzkoušet <a href="#" @click.prevent="beginDemo">demo účet</a>.
      </p>
    </template>
    <template v-else>
      <p>
        Vítejte zpět v aplikaci {{ appName }}. Počet evidovaných šelem: <b>{{ beastSummary.count }}</b>.
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive} from 'vue';
import {translateMixin} from "@/i18n";
import authStore from "@/modules/auth/store/authStore";
import appStore from "@/modules/app/store/appStore";
import beastsStore from "@/modules/bestiary/store/beastsStore";
import demoStore from "@/modules/demo/store/demoStore";

export default defineComponent({
  name: 'Home',
  mixins: [
    translateMixin,
  ],
  setup() {
    const beastSummary = reactive({
      count: computed(() => beastsStore.getters.count())
    })
    const userAuthenticated = computed(() => authStore.getters.isLoggedIn())

    return {
      appName: appStore.state.appName,
      userAuthenticated,
      beginDemo: () => {
        demoStore.actions.initDemoData()
          .then(() => console.log("Data initialized"))
      },
      beastSummary,
    }
  },
});
</script>
