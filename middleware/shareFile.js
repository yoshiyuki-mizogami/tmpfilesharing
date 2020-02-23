import bytes from 'bytes'
let id = 0
const noop = ()=>{}
export default class ShareFile{
  constructor(file){
    this.id = ShareFile.cursor++
    this.name = file.name
    this.size = bytes(file.size)
    this.file = file
    this.buf = null
    this.loaded = false
  }
  readFile(){
    const fr = new FileReader()
    fr.readAsDataURL(this.file)
    return new Promise(r=>{
      fr.addEventListener('load', (ev)=>{
        this.buf = ev.target.result.replace(/^.+base64,/, '')
        r()
      })
    })
  }
}
ShareFile.cursor = 0