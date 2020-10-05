const User = require('../models/User')
const { sign } = require('jsonwebtoken')

module.exports = {
  async auth(req, res) {
    try {
      // const { id, name } = req.body
      
      return res.json({ eita: 'porra' })
    } catch (error) {
      return res.json({ error })
    }
  }
}