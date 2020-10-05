const express = require('express')
const { connect } = require('mongoose')
const routes = require('./routes')
const cors = require('cors')

connect('mongodb://localhost:27017/Convoy', { useNewUrlParser: true, useUnifiedTopology: true })

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(3333, () => console.log('Localhost running on 3333'))