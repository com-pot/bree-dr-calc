<script lang="ts" setup>
import { ref } from "vue"
import { useI18n } from "@typeful/vue-app/i18n"
import appStore from "@typeful/vue-app/store/appStore"

const i18n = useI18n()
const possibleExtensions = ref([
  {
    name: 'extenal-db',
    caption: "Napojení na existující databázi",
    description: "Načítání a odesílání šelem ke schválení",
  },
  {
    name: 'data-mode:online',
    caption: 'Online režim',
    description: "Ukládání údajů online umožňující práci na více zařízeních",
  }
])

</script>

<template>
  <div class="about">
    <h1>O aplikaci</h1>
    <p>
      Tato aplikace vznikla za účelem zjednodušení výpočtu <em class="term"
      v-tippy="{content: i18n.t('bestiary.wrightCoefficient.termDefinition')}">Wrightova
      koeficientu</em> příbuzenské plemenitby.
    </p>

    <p>
      Aktuální verze aplikace je: <b>{{ appStore.state.appVersion }}</b>.
    </p>
    <p>
      Zdrojové kódy aplikace jsou otevřené a k nalezení, prozkoumání a návrhům k úpravám na
      portálu <a :href="appStore.state.repoLink" target="_blank">GitHub</a>. Zn.: Kritika je vítána v podobě návrhů na změn a Pull Requestů.
    </p>

    <h2>Možná rozšíření</h2>

    <div class="tile-grid">
      <article class="card extension-card" v-for="extension of possibleExtensions" :key="extension.name">
        <header class="card-header">
          <h1>{{ extension.caption }}</h1>
          <span data-name="name">{{ extension.name }}</span>
        </header>
        <div class="card-body">
          <p>{{ extension.description }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style lang="scss">
.tile-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(40ch, 1fr));
}
.extension-card {
  .card-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    [data-name="name"] {
      font-size: 0.75rem;
      opacity: 0.75;

      &::before {
        content: '[';
      }
      &::after {
        content: ']';
      }
    }
  }
}
</style>
