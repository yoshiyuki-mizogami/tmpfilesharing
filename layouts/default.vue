<template>
  <v-app>
    <v-app-bar color="primary" app class="font-weight-black">
      TeFSS - Temporary File Sharing System-
      <span class="caption ml-10">-5分だけ共有できるんだぜ</span>
    </v-app-bar>
    <v-content>
        <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [ ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'TeFSS'
    }
  }
}
</script>
