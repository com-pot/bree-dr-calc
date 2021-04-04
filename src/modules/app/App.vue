<template>
  <div id="app">
    <Navbar :app-name="appName" :nav-links="navLinks"/>

    <main class="container">
      <router-view/>
    </main>

    <Footer class="card">
      <template #links>
        <router-link :to="{name: 'app.About'}">{{ $t('app.view.About') }}</router-link>
        <template v-if="userAuthenticated">
          <div class="spacer"/>
          <router-link :to="{name: 'auth.AuthInfo'}">{{ $t('auth.view.AuthInfo') }}</router-link>
        </template>
      </template>
    </Footer>
  </div>
</template>

<script>
import {computed} from "vue"

import i18n, {translateMixin} from "@/i18n";
import Navbar from "@/modules/app/layouts/Navbar";
import Footer from "@/modules/app/layouts/Footer";
import appStore from "@/modules/app/store/appStore";
import authStore from "@/modules/auth/store/authStore";

export default {
  components: {Footer, Navbar},
  mixins: [
    translateMixin,
  ],
  setup() {
    const userAuthenticated = computed(() => authStore.getters.isLoggedIn())

    const navLinks = computed(() => {
      const links = [
        {to: {name: 'bestiary.BreedingStationsIndex'}, text: i18n.translate('bestiary.view.BreedingStationsIndex')},
      ]
      if (userAuthenticated.value) {
        links.unshift({to: {name: 'bestiary.MyBeasts'}, text: i18n.translate('bestiary.view.MyBeasts')})
      }

      return links
    })


    return {
      appName: appStore.state.appName,
      navLinks,
      userAuthenticated,
    }
  },
  mounted() {
    this.$el.classList.add('layout-simple')
  }
}
</script>
