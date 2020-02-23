<template>
  <v-layout
    column
    justify-center
    align-center
  >
  <v-container>
    <p class="text-center">シェアしたファイルはサーバのメモリ上のみに存在しどこにも永続化されず、5分で消されます</p>
    <p class="text-center"></p>
    <v-row justify="center">
      <v-btn width="270px" to="/entry" color="primary ma-3">Share File Entry <v-icon>mdi-share</v-icon></v-btn>
      <v-btn width="270px" to="/enter" color="primary ma-3">Download ShareFile <v-icon>mdi-download</v-icon></v-btn>
    </v-row>
  </v-container>
  </v-layout>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
})
</script>