const { Router } = require('express')
const { auth } = require('./controllers/User')

const routes = Router()

routes.get('/auth', auth)

module.exports = routes