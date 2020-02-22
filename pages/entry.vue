<template>
  <v-container>
    <v-row justify="center">
      <v-subheader><v-content>Input Entry Name</v-content></v-subheader>
    </v-row>
    <v-row justify="center">
      <v-col cols="8" md="4">
        <v-text-field v-model="entryName"
        :counter="15" label="Sharing Entry name"
        hint="シェアする名前を指定します5文字以上"
        persistent-hint
        :readonly="fixedEntry"/>
      </v-col>
      <v-col cols="8" md="4">
        <v-text-field v-model="entryPass" type="password"
          :counter="15" label="Sharing Password(Optional)"
          hint="設定するとダウンロード時にパスワードを求めます(任意)"
          persistent-hint
          :readonly="fixedEntry"/>
      </v-col>
    </v-row>
    <v-container>
      <v-row justify="center" dense>
        <v-col cols="8" md="2">
          <v-btn block="" color="primary" @click="selectFile"  :disabled="fixedEntry">Select your sharing file</v-btn>
        </v-col>
        <v-col cols="8" md="2">
          <v-btn block="" color="primary" :disabled="!uploadable || fixedEntry" @click="upload">Upload</v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" dense>
        <v-col cols="8" md="2">
          <v-content>LimitSize / TotalSize : {{sumSizeStr}} / 50MB</v-content>
        </v-col>
      </v-row>
      <input type="file" v-if="showFileInput" ref="fileinput" multiple style="visibilty:hidden;height:1px;width:1px;position:fixed;right:0;bottom:0;"/>
    </v-container>
    <v-container>
      <v-row class="justify-center" max-width="800%" width="80%">
        <v-list max-width="800px" width="100%" >
          <v-list-item-group v-model="entryFiles" >
            <v-list-item inactive v-for="f in entryFiles" :key="f.id">
              <v-list-item-icon>
                <v-icon>mdi-file</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{f.name}} <span class="ml-5 grey--text text--darken-1 caption">{{f.size}}</span></v-list-item-title>
              <v-progress-circular v-if="!f.loaded"
                indeterminate
                color="green"
              ></v-progress-circular>
              <v-btn icon class="ml-5" @click.stop.capture="removeEntryFile(f)" :disabled="fixedEntry">
                <v-icon>mdi-close</v-icon>
              </v-btn>
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
<script lang="ts">
import {Vue, Component} from 'nuxt-property-decorator'
import {mapMutations,mapGetters} from 'vuex'
import bytes from 'bytes'
@Component({
  computed:{
    ...mapGetters(['sumSize'])
  },
  methods:{
    ...mapMutations(['removeEntryFile', 'fixEntry'])
  }
})
export default class Entry extends Vue{
  public showFileInput = false
  get fixedEntry(){
    return this.$store.state.entry.fixed
  }
  get sumSizeStr(){
    return bytes((this as any).sumSize)
  }
  get entryName(){
    return this.$store.state.entry.name
  }
  set entryName(name:string){
    this.$store.commit('setEntryName', name)
  }
  get entryPass(){
    return this.$store.state.entry.pass
  }
  set entryPass(name:string){
    this.$store.commit('setEntryPass', name)
  }
  get entryFiles(){
    return this.$store.state.entry.files
  }
  set entryFiles(files:any[]){}
  get uploadable(){
    const ret = this.$store.state.entry.files.length !== 0 && 
       this.entryName.length >= 5 &&
       this.$store.state.entry.files.every((f:any)=>f.loaded)
    return ret
  }
  upload():void{
    (this as any).fixEntry()
    this.$store.dispatch('upload')
  }
  fix():void{
  }
  selectFile():void{
    this.showFileInput = true
    this.$nextTick(()=>{
      const fi = this.$refs.fileinput as HTMLInputElement
      fi.addEventListener('change', ()=>{
        if(!fi.files || fi.files.length === 0){
          return
        }
        this.$store.dispatch('addEntryFiles', Array.from(fi.files))
        this.showFileInput = false
      })
      fi.click()
    })
  }
}
</script>