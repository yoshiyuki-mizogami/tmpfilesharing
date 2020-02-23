import axios from 'axios'
import {Store} from 'vuex'
import ShareFile from '../middleware/shareFile'
import {MAX_FILESIZE} from '../middleware/params'
import {OVERFILESIZE,UPLOAD_FAILED,UPLOAD_SUCCEED} from '../middleware/messages'

interface ShareEntryListItem {
  name:string
  count:number,
  existsPass:boolean
}
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
  } as {
    name:string,
    pass:string,
    files:ShareFile[],
    fixed:boolean
  },
  entries:[] as ShareEntryListItem[],
  enterPass:''
})

export const mutations = {
  setEntryName(state:any, name:string):void{
    state.entry.name = name
  },
  setEntryPass(state:any, pass:string):void{
    state.entry.pass = pass
  },
  setEnterPass(state:any, pass:string):void{
    state.enterPass = pass
  },
  addEntryFiles(state:any, files:ShareFile[]|any){
    if(!(files instanceof Array)){
      return
    }
    state.entry.files.push(...files)
  },
  entryFileLoaded(state:any, file:ShareFile){
    const f = state.entry.files.find((f:ShareFile)=>f === file)
    if(!f){
      return
    }
    f.loaded = true
  },
  removeEntryFile(state:any, file:ShareFile){
    const i = state.entry.files.indexOf(file)
    state.entry.files.splice(i,1)
  },
  fixEntry(sate:any){
    sate.entry.fixed = true
  },
  clearEntry(state:any){
    const {entry} = state
    entry.name = 
    entry.pass = ''
    entry.files = []
    entry.fixed = false
  },
  setShowSnack(state:any, tf:boolean){
    state.snack.show = tf
  },
  snackMessageSet(state:any, param:any){
    state.snack.show = true
    state.snack.message = param.message
    state.snack.color = param.color
  },
  setEntries(state:any, entries:ShareEntryListItem[]){
    state.entries = entries
  }
}

export const actions = {
  addEntryFiles(store:Store<any>, files:File[]){
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
  async upload(store:Store<any>){
    const {state:{entry}} = store
    const uploadData = {
      name:entry.name,
      pass:entry.pass,
      files:entry.files.map((f:ShareFile)=>{
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
  async getAllEntries(store:Store<any>):Promise<any>{
    const response = await axios.get('/entries')
    const data:ShareEntryListItem[] = response.data
    store.commit('setEntries', data)
  }
}

export const getters = {
  sumSize(state:any){
    return state.entry.files.reduce((total:number, current:ShareFile)=>{
      return total + current.file.size
    }, 0)
  }
}
