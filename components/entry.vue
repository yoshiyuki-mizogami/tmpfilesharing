<template>
  <v-form>
    <v-content>Input Entry Name</v-content>
    <v-container>
      <v-row justify="center">
        <v-col cols="8" md="4">
          <v-text-field v-model="entry.name"
          :counter="15" label="Sharing Entry name"
          hint="シェアする名前を指定します"
          persistent-hint
          :readonly="fixedEntry"/>
        </v-col>
        <v-col cols="8" md="4">
          <v-text-field v-model="entry.pass" type="password"
            :counter="15" label="Sharing Password(Optional)"
            hint="設定することでシェアする際にパスワードを求めます"
            persistent-hint
            :readonly="fixedEntry"/>
        </v-col>
      </v-row>
      <v-row justify="center" v-show="!fixedEntry">
        <v-col cols="8" md="2">
          <v-btn block color="primary" @click="fix" :disabled="!entry.name">Entry</v-btn>
        </v-col>
      </v-row>
      <transition name="slidedown">
        <v-container v-show="fixedEntry">
          <v-row justify="center">
            <v-col cols="8" md="2">
              <v-btn block="" color="primary" @click="selectFile">Select your sharing file</v-btn>
            </v-col>
          </v-row>
          <input type="file" v-if="showFileInput" ref="fileinput" multiple style="visibilty:hidden;height:1px;width:1px;"/>
        </v-container>
      </transition>
    </v-container>
  </v-form>
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
import ShareFile from './shareFile'
interface EntryInterface{
  name:string,
  pass:string,
  files:ShareFile[]
}

@Component
export default class Entry extends Vue{
  public entry:EntryInterface = {
    name:'',
    pass:'',
    files:[]
  }
  public showFileInput = false
  public fixedEntry = false
  fix():void{
    this.fixedEntry = true
  }
  selectFile():void{
    this.showFileInput = true
    this.$nextTick(()=>{
      const fi = this.$refs.fileinput as HTMLInputElement
      fi.addEventListener('change', ()=>{
        if(!fi.files || fi.files.length === 0){
          return
        }
        this.entry.files = Array.from(fi.files).map(f=>new ShareFile(f))
        this.showFileInput = false
      })
      fi.click()
    })
  }
}
</script>