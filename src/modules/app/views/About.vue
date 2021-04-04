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
      portálu <a :href="repoLink" target="_blank">GitHub</a>. Zn.: Kritika je vítánáv podobě Pull Requestů.
    </p>
    <h2>Upozornění o datech</h2>
    <p>
      Aplikace aktuálně slouží pouze jako kalkulačka a osobní rejstřík. Pracujete totiž v režimu <b
      class="text-warning">offline</b> a
      všechna data jsou uložena v paměti prohlížeče anebo na vašem disku. <br/>
      Možnost sdílet vaše šelmy anebo načítat data z vnějších databází je otázkou budoucího rozšíření.
    </p>
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
