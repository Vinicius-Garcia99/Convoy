const Report = require('../models/Report')
const { Types } = require('mongoose')
const { ObjectId } = Types

module.exports = {
  async getReports(req = {}, res) {
    try {
      let { _id, type } = req.query || {}
      _id = ObjectId(_id)
      const query = type === 'agent' ? {} : { 'user._id': _id }

      const reports = await Report.find(query)
      
      return res.json(reports)
    } catch (error) {
      return res.json({ error })
    }
},

  async addReport(req = {}, res) {
    try {
      let { _id, name, reportInput = '' } = req.body
      _id = ObjectId(_id)

      const report = await Report.create({ text: reportInput, user: { _id, name } })

      return res.json(report)
    } catch (error) {
      return res.json({ error })
    }
  }
}