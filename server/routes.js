const consola = require('consola')
const {json, send} = require('micro')
const shareEntry = require('./shareEntry')
const bytes = require('bytes')
module.exports.register = async (req, res)=>{
  const data = await json(req,{limit:'100mb'})
  consola.info(`File count: ${data.files.length}`)
  try{
    shareEntry.add(data)
  }catch(e){
    return send(res, 200, {
      success:false,
      message:e.message
    })
  }
  send(res, 200,{
    success:true,
    message:'Register success.'
  })
}

module.exports.getEntries = async (req, res)=>{
  const all = shareEntry.getAllEntries()
  const entries = all.map(d=>{
    return {
      name:d.name,
      count:d.count,
      existsPass:!!d.pass
    }
  })
  send(res, 200, entries)
}

module.exports.getEntry = async (req, res, {params})=>{
  const {name} = params
  const ret = shareEntry.get(name)
  if(!ret){
    return send(res, 200, {
      success:false,
      message:'もうないです Entry disappeared'
    })
  }
  if(ret.pass){
    const {password} = json(req)
    if(ret.pass !== password){
      return send(res, 200, {
        success:false,
        message:'パスワード不正 Invalid Password'
      })
    }

  }
  const result = {
    success:true,
    name:ret.name,
    files:ret.files.map(f=>{
      return {
        name:f.name,
        size:bytes(f.size),
        body:f.body.toString('base64')
      }
    })
  }
  send(res, 200, result)
}