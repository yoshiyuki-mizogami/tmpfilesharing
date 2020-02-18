export default class ShareFile{
  name:string
  size:number
  buf:ArrayBuffer|unknown
  loaded = false
  constructor(file:File){
    this.name = file.name
    this.size = file.size
    this.readFile(file)
  }
  readFile(file:File){
    const fr = new FileReader()
    fr.readAsArrayBuffer(file)
    fr.addEventListener('load', (ev:Event)=>{
      this.buf = (ev.target as any).result as ArrayBuffer
    })
  }
}