<template>
  <div class="about">
    <h1>O aplikaci</h1>
    <p>
      Tato aplikace vznikla za účelem zjednodušení výpočtu <em
      v-tippy="$t('bestiary.wrightCoefficient.termDefinition')">Wrightova
      koeficientu</em> příbuzenské plemenitby.
    </p>

    <p>
      Aktuální verze aplikace je: <b>{{ appVersion }}</b>.
    </p>
    <p>
      Zdrojové kódy aplikace jsou otevřené a k nalezení, prozkoumání a návrhům k úpravám na
      portálu <a :href="repoLink" target="_blank">GitHub</a>. Zn.: Kritika je vítána v podobě Pull Requestů.
    </p>

    <h2>Možná rozšíření</h2>
    <ul class="list-unstyled">
      <li>Načítání hodnot z existující databáze</li>
      <li>Odesílání dat ke schválení do existující databáze</li>
      <li>Online režim - více uživatelů spravující stanice a šelmy</li>
    </ul>
  </div>
</template>

<script>
import {translateMixin} from "@/i18n.ts";
import appStore from "@/modules/app/store/appStore.ts";

export default {
  mixins: [
    translateMixin,
  ],
  setup() {
    return {
      appVersion: appStore.state.appVersion,
      repoLink: appStore.state.repoLink,
    }
  },
}
</script>
