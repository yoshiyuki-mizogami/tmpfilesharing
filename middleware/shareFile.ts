import bytes from 'bytes'
let id = 0
const noop = ()=>{}
export default class ShareFile{
  static cursor = 0
  id:number
  name:string
  size:string
  buf:ArrayBuffer|unknown
  loaded = false
  file:File
  constructor(file:File){
    this.id = ShareFile.cursor++
    this.name = file.name
    this.size = bytes(file.size)
    this.file = file
  }
  readFile(){
    const fr = new FileReader()
    fr.readAsArrayBuffer(this.file)
    return new Promise(r=>{
      fr.addEventListener('load', (ev:Event)=>{
        this.buf = (ev.target as any).result as ArrayBuffer
        r()
      })
    })
  }
}