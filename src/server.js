const PORT = 3033
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('./cors')
const routes = require('./routes')
const mongoose = require('mongoose')

const server = express()
mongoose.connect('mongodb://localhost/bayer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(cors)
server.use(routes)
server.listen(PORT, () => {
    console.log(`Servidor de Teste Bayer. Porta ${PORT}`)
})

module.exports = server
