<template>
  <v-app>
    <v-app-bar color="primary" app class="font-weight-black">
      <v-toolbar-title>Temporary File Sharing System</v-toolbar-title>
      <span class="caption ml-5 grey--text text--lighten-1">-5 minutes sharing-</span>
    </v-app-bar>
    <v-content>
        <nuxt />
    </v-content>
    <v-bottom-navigation>
      <v-btn to="/">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/entry">
        <span>Share</span>
        <v-icon>mdi-share</v-icon>
      </v-btn>
      <v-btn to="/enter">
        <span>Download</span>
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-bottom-navigation>
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
