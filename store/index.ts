import {Store} from 'vuex'
import ShareFile from '../middleware/shareFile'

export const state = ()=>({
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
  enter:{
    name:'',
    pass:'',
    files:[]
  } as {
    name:string,
    pass:string,
    files:ShareFile[]
  }
})

export const mutations = {
  setEntryName(state:any, name:string):void{
    state.entry.name = name
  },
  setEntryPass(state:any, pass:string):void{
    state.entry.pass = pass
  },
  setEnterName(state:any, name:string):void{
    state.enter.name = name
  },
  setEnterPass(state:any, pass:string):void{
    state.enter.pass = pass
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
  }
}

export const actions = {
  addEntryFiles(store:Store<any>, files:File[]){
    const sFiles = files.map(f=>new ShareFile(f))
    store.commit('addEntryFiles', sFiles)
    sFiles.forEach(async sfile=>{
      await sfile.readFile()
      store.commit('entryFileLoaded', sfile)
    })
  }
}

export const getters = {
  sumSize(state:any){
    return state.entry.files.reduce((total:number, current:ShareFile)=>{
      return total + current.file.size
    }, 0)
  }
}
