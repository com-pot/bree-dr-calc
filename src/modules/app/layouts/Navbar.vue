<template>
  <div v-if="navLinks" id="navbar">
    <router-link class="brand" to="/">{{ appName }}</router-link>

    <nav>
      <template v-for="(link, i) in navLinks" :key="i">
        <router-link :to="link.to">{{ link.text }}</router-link>
        <i v-if="i < navLinks.length - 1" class="spacer"></i>
      </template>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    appName: {type: String, required: true},
    navLinks: {type: Array, required: true},
  }
}
</script>
