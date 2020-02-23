const micro = require('micro')
const dispatch = require('micro-route/dispatch')
const {register, getEntries, getEntry} = require('../api/routes')

const app = micro(async (req, res) => {
  await dispatch()
  .dispatch('/entries/:name',['POST'], getEntry)
  .dispatch('/entries', ['GET'], getEntries)
  .dispatch('/register', ['POST'], register)(req, res)
})

module.exports = {
  path:'/api',
  handler:app
}