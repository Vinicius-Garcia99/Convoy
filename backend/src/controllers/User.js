const User = require('../models/User')

module.exports = {
  async auth(req = {}, res) {
    try {
      const { id, name } = req.body || {}
      const query =  !!id ? ({ facebookId: id, name, type: 'user' }) : ({ name, type: 'agent' })

      const user = await User.findOneAndUpdate({ name }, { $set: query }, { new: true, upsert: true })

      return res.json(user)
    } catch (error) {
      return res.json({ error })
    }
  }
}