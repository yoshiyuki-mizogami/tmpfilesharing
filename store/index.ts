import {Store} from 'vuex'

export const state = ()=>({
  entry:{
    name:'',
    pass:'',
    files:[]
  },
  enter:{
    name:'',
    pass:'',
    files:[]
  }
})

export const mutation = ()=>({
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
  }
})

export const actions = ()=>({
  entry(store:Store<any>){

  },
  enter(store:Store<any>){

  }
})