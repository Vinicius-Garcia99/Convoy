const express = require('express')
const { connect } = require('mongoose')
const routes = require('./routes')
const cors = require('cors')

const app = express()

connect('mongodb://localhost:27017/Convoy', 
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(3333, () => console.log('Localhost running on 3333'))