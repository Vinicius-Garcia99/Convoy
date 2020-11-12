const { Schema, model, Types } = require('mongoose')

const ReportSchema = new Schema({
  user: { _id: { type: Types.ObjectId, ref: 'user' }, name: String },
  text: String,
}, { versionKey: false, timestamps: true })

module.exports = model('report', ReportSchema)