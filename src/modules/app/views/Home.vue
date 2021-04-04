<template>
  <div class="home">
    <template v-if="!userAuthenticated">
      <p>Vítejte v aplikace {{ appName }}. Nyní zde nemáte uloženy žádné údaje.</p>

      <div class="start-actions">
        <router-link :to="{name: 'auth.SignIn'}" class="btn btn-primary">Připravit prázdná data</router-link>
        <button class="btn btn-secondary" @click.prevent="beginDemo">Načíst demo data</button>
      </div>

      <p class="mt-5">
        Více se můžete dočíst na stránce <router-link :to="{name: 'app.About'}">{{ $t('app.view.About') }}</router-link>.
      </p>
    </template>

    <template v-else>
      <p>
        Vítejte zpět v aplikaci {{ appName }}.
      </p>
      <p>
        Právě máte uloženo <router-link :to="{name: 'bestiary.MyBeasts'}">{{ bestiarySummary.beastCount }} šelem</router-link>
        v <router-link :to="{name: 'bestiary.BreedingStationsIndex'}">{{ bestiarySummary.stationCount }} stanicích</router-link>.
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
    const bestiarySummary = reactive({
      beastCount: computed(() => beastsStore.state.beastList.length),
      stationCount: computed(() => beastsStore.state.breedingStations.length)
    })
    const userAuthenticated = computed(() => authStore.getters.isLoggedIn())

    return {
      appName: appStore.state.appName,
      userAuthenticated,
      beginDemo: () => {
        demoStore.actions.initDemoData()
      },
      bestiarySummary,
    }
  },
});
</script>

<style lang="scss">
.start-actions {
  display: flex;
  flex-direction: column;
  align-items: center;

  .btn-primary {
    padding: 1em;
    font-size: 24pt;
  }

  .btn-secondary {
    margin-top: 0.5em;

    padding: 0.25em 1em;
  }
}
</style>
