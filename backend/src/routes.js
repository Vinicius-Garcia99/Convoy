const { Router } = require('express')
const { auth } = require('./controllers/User')
const { addReport, getReports } = require('./controllers/Report')
const { addAlert, answerAlert } = require('./controllers/Alert')

const routes = Router()

routes.post('/auth', auth)
routes.post('/addReport', addReport)
routes.get('/getReports', getReports)
routes.post('/addAlert', addAlert)
routes.post('/answerAlert', answerAlert)

module.exports = routes