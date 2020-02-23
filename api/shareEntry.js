const LIFESPAN = 1000 * 60 * 5
const LIMIT_SIZE = 1024 * 1024 * 1024 * 50
const NAME_LIMIT = 15
class ShareData {
  constructor(){
    this.storeData = new Map()
  }
  add(postData){
    const {name, files} = postData
    if(!name || NAME_LIMIT < name.length){
      throw new Error(`Invalid data`)
    }
    const {storeData} = this
    if(storeData.has(name)){
      throw new Error(`${name} is already exists`)
    }
    try{
      const total = files.reduce((total,f)=>{
        f.body = Buffer.from(f.body, 'base64')
        f.size = f.body.length
        total += f.size
      }, 0)
      if(LIMIT_SIZE < total){
        throw new Error('File size exceed.')
      }
    }catch(e){
      consola.error(e)
      throw new Error(`${name} invalid data`)
    }
    postData.count = files.length
    storeData.set(name,postData)
    setTimeout(()=>{
      delete storeData.delete(name)
    }, LIFESPAN)
  }
  getAllEntries(){
    return Array.from(this.storeData.values())
  }
  get(name){
    if(!this.storeData.has(name)){
      return false
    }
    return this.storeData.get(name)
  }
}

const share = new ShareData()

module.exports = share