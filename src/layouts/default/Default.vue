<template>
  <v-app>
    <default-bar />
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import { createVuetify } from 'vuetify'
  export const vuetify = createVuetify({
  theme: { defaultTheme: 'dark' },
})

</script>

