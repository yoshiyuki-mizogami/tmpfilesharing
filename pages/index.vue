<template>
  <v-layout
    column
    justify-center
    align-center
  >
  <v-container>
    <entry/>
  </v-container>
  </v-layout>
</template>
<script lang="ts">
import Vue from 'vue'
import Entry from '../components/entry.vue'
export default Vue.extend({
  components:{
    Entry
  }
})
</script>