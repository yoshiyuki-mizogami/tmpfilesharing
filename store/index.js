import axios from 'axios'
import ShareFile from '../middleware/shareFile'
import {MAX_FILESIZE} from '../middleware/params'
import {OVERFILESIZE,UPLOAD_FAILED,UPLOAD_SUCCEED} from '../middleware/messages'

export const state = ()=>({
  snack:{
    show:false,
    message:'',
    color:'green'
  },
  entry:{
    name:'',
    pass:'',
    files:[],
    fixed:false
  },
  entries:[],
  enterPass:''
})

export const mutations = {
  setEntryName(state, name){
    state.entry.name = name
  },
  setEntryPass(state, pass){
    state.entry.pass = pass
  },
  setEnterPass(state, pass){
    state.enterPass = pass
  },
  addEntryFiles(state, files){
    if(!(files instanceof Array)){
      return
    }
    state.entry.files.push(...files)
  },
  entryFileLoaded(state, file){
    const f = state.entry.files.find((f)=>f === file)
    if(!f){
      return
    }
    f.loaded = true
  },
  removeEntryFile(state, file){
    const i = state.entry.files.indexOf(file)
    state.entry.files.splice(i,1)
  },
  fixEntry(sate){
    sate.entry.fixed = true
  },
  clearEntry(state){
    const {entry} = state
    entry.name = 
    entry.pass = ''
    entry.files = []
    entry.fixed = false
  },
  setShowSnack(state, tf){
    state.snack.show = tf
  },
  snackMessageSet(state, param){
    state.snack.show = true
    state.snack.message = param.message
    state.snack.color = param.color
  },
  setEntries(state, entries){
    state.entries = entries
  }
}

export const actions = {
  addEntryFiles(store, files){
    const currentSize = store.getters.sumSize
    let totalSize = currentSize
    const sFiles = files.map(f=>new ShareFile(f))
    let over = false
    const sizeFiltered = sFiles.filter(f=>{
      const size = f.file.size
      totalSize += size
      const exceed = MAX_FILESIZE < totalSize
      if(exceed){
        over = true
        return false
      }
      return true
    })
    if(over){
      store.commit('snackMessageSet',{
        message:OVERFILESIZE,
        color:'red'
      })
    }
    store.commit('addEntryFiles', sizeFiltered)
    sizeFiltered.forEach(async sfile=>{
      await sfile.readFile()
      store.commit('entryFileLoaded', sfile)
    })
  },
  async upload(store){
    const {state:{entry}} = store
    const uploadData = {
      name:entry.name,
      pass:entry.pass,
      files:entry.files.map((f)=>{
        return {
          name:f.name,
          body:f.buf
        }
      })
    }
    const response = await axios.post('/register', uploadData)
    store.commit('clearEntry')
    if(!response.data.success){
      return store.commit('snackMessageSet', {
        message:`${UPLOAD_FAILED} ${response.data.message}`,
        color:'red'
      })
    }
    
    store.commit('snackMessageSet', {
      message:UPLOAD_SUCCEED,
      color:'green'
    })
  },
  async getAllEntries(store){
    const response = await axios.get('/entries')
    const data = response.data
    store.commit('setEntries', data)
  }
}

export const getters = {
  sumSize(state){
    return state.entry.files.reduce((total, current)=>{
      return total + current.file.size
    }, 0)
  }
}
