<template>
  <v-container>
    <v-row justify="center">
      <v-subheader class="display-2">{{entry.name}}</v-subheader>
    </v-row>
    <v-container>
      <v-alert v-if="error" class="red--text text--darken-1">
        {{errorMessage}}
        <nuxt-link to="/enter">Back</nuxt-link>
      </v-alert>
      <v-row v-if="!loaded && !error" justify="center">
        <v-progress-circular
          width="7"
          size="70"
          indeterminate
          color="green"
        ></v-progress-circular>
      </v-row>
      <v-row v-show="entry.files.length" justify="center">
        <v-btn color="primary" @click="downloadAllAsZip">Download all as zip</v-btn>
      </v-row>
      <v-row v-show="entry.files.length" class="justify-center" max-width="800%" width="80%">
        <v-list max-width="800px" width="100%" >
          <v-list-item-group>
            <v-list-item inactive @click="download(f)" v-for="(f,ind) in entry.files" :key="ind">
              <v-list-item-icon>
                <v-icon>mdi-file</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{f.name}} <span class="ml-5 grey--text text--darken-1 caption">{{f.size}}</span></v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-row>
    </v-container>
  </v-container>
</template>
<style>
.slidedown-enter-active,.slidedown-leave-active{
  transition:all 1s ease;
  opacity:1;
}
.slidedown-enter,.slidedown-leave-to{
  opacity:0;
}
</style>
<script>
import axios from 'axios'
import jsZip from 'jszip'

export default {
  data(){
    return {
      loaded:false,
      error:false,
      entry:{
        name:'',
        files:[]
      }
    }
  },
  async created(){
    const password = this.$store.state.enterPass
    const paramName = this.$route.params.name
    const response = await axios.post(`/api/entries/${paramName}`,{
      password
    })
    const {data} = response
    const {success} = data
    if(!success){
      this.error = true
      this.errorMessage = data.message
      return 
    }
    this.loaded = true
    this.entry = data
  },
  methods:{
    async download(file){
      const url = 'data:octet/stream;base64,' + file.body
      const blob = await fetch(url).then(r=>r.blob())
      this.saveAs(file.name, blob)
    },
    async downloadAllAsZip(){
      const {files} = this.entry
      const zip = new jsZip()
      const folder = zip.folder(this.entry.name)
      files.forEach(f=>{
        folder.file(f.name,f.body,{base64:true})
      })
      const blob = await zip.generateAsync({type:'blob'})
      this.saveAs(this.entry.name, blob)
    },
    saveAs(filename, blob){
      const a = document.createElement('a')
      a.setAttribute('download', filename)
      a.setAttribute('style', 'position:abosolute;right:0;bottom:0;visibility:hidden')
      a.href = URL.createObjectURL(blob)
      document.body.appendChild(a)
      a.click()
      setTimeout(()=>{
        URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
      }, 300)
    }

  }
}
</script>