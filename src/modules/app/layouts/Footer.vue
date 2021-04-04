<template>
  <footer class="app-footer">
    <b class="app-connection-notice text-warning">Offline</b>
    <i class="spacer"/>
    <nav v-if="$slots.links">
      <slot name="links"/>
    </nav>
  </footer>
</template>
