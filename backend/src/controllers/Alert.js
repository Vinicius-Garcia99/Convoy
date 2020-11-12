const Alert = require('../models/Alert')
const { Types } = require('mongoose')
const { ObjectId } = Types

module.exports = {
  async addAlert(req = {}, res) {
    try {
      let { _id, latitude, longitude } = req.body || {}
      _id = ObjectId(_id)

      const alert = await Alert.create({ user: _id, longitude, latitude, status: 'ativo' })

      req.io.emit('alert', alert)

      return res.json(alert)
    } catch (error) {
      return res.json({ error })
    }
  },
  async answerAlert(req = {}, res) {
    try {
      const { alert, coords } = req.body || {}

      const newAlert = await Alert.findOneAndUpdate({ _id: ObjectId(alert._id) }, { $set: { status: 'atendido', agent: coords } }, { new: true }) || {}

      req.io.emit('answer', newAlert.agent)
      
      return res.json(newAlert)
    } catch (error) {
      return res.json({ error })
    }
  }
}