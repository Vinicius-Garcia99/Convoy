const { Schema, model, Types } = require('mongoose')

const AlertSchema = new Schema({
  longitude: Number,
  latitude: Number,
  user: { type: Types.ObjectId, ref: 'user' },
  status: String,
  agent: {
    longitude: Number,
    latitude: Number
  }
}, { timestamps: true, versionKey: false })

module.exports = model('alert', AlertSchema)