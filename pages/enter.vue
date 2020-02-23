<template>
  <v-container>
    <p class="subtitle-1 text-center">Sharing Data List</p>
    <p class="text-center" v-if="entries.length">Select you want</p>
    <p class="text-center" v-else>Nothing Sharing entry</p>
    <v-container>
      <v-row class="justify-center" max-width="800%" width="80%">
        <v-list v-show="entries.length" max-width="800px" width="100%" >
          <v-list-item-group>
            <v-list-item @click="openEntry(f)" inactive v-for="(f,i) in entries" :key="i">
              <v-list-item-icon>
                <v-icon>mdi-file</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{f.name}} <span class="ml-5 grey--text text--darken-1 caption">File count:{{f.count}}</span></v-list-item-title>
              <v-list-item-icon v-if="f.existsPass">
                <v-icon style="transform:rotate(90deg)">mdi-key</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-row>
    </v-container>
    <v-dialog v-model="passDialog" max-width="500">
      <v-card class="pa-2">
        <v-card-title>Require password</v-card-title>
        <v-text-field 
          class="pl-5 pr-5"
          type="password"
          label="Input password"
          v-model="password"
        />
        <v-card-actions>
          <v-btn color="primary" text @click="setShowPasswordDialog(false)">Cancel</v-btn>
          <v-btn color="primary" :disabled="!password" text @click="moveEntryFromPasswordDaialog">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import {Vue, Component} from 'nuxt-property-decorator'
import {mapMutations,mapGetters} from 'vuex'
import bytes from 'bytes'

@Component
export default class Enter extends Vue{
  targetFile:any = null
  passDialog = false
  password = ''
  get entries(){
    return this.$store.state.entries
  }
  created(){
    this.targetFile = null
    this.$store.dispatch('getAllEntries')
  }
  async openEntry(f:any){
    if(f.existsPass){
      this.targetFile = f
      return this.setShowPasswordDialog(true)
    }
    this.moveEntry(f)
  }
  moveEntry(f:any){
    this.$router.push({path:`open/${f.name}`})
  }
  setShowPasswordDialog(tf:boolean){
    this.password = ''
    this.passDialog = tf
  }
  moveEntryFromPasswordDaialog(){
    this.$store.commit('setEnterPass', this.password)
    this.setShowPasswordDialog(false)
    this.moveEntry(this.targetFile)
  }

}
</script>