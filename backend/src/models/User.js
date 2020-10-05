const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  name: String,
  facebookId: String
}, { versionKey: false })

module.exports = model('user', UserSchema)