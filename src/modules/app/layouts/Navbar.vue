<template>
  <nav class="navbar sticky-top navbar-expand navbar-light bg-light" id="navbar">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">{{ appName }}</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <template v-for="(link, i) in navLinks" :key="i">
            <li class="nav-item">
              <router-link :to="link.to" class="nav-link" active-class="active"
                           aria-current-value="page">{{ link.text }}</router-link>
            </li>
            <i v-if="i < navLinks.length - 1" class="spacer"></i>
          </template>
<!--          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
          </li>-->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    appName: {type: String, required: true},
    navLinks: {type: Array, required: true},
  }
}
</script>
