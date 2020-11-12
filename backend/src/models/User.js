const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  name: String,
  facebookId: String,
  type: { type: String, enum: ['user', 'agent'] }
}, { versionKey: false })

module.exports = model('user', UserSchema)