const express = require('express')
const http = require('http')

const app = express()

const server = http.createServer(app)

const { Server } = require("socket.io")

const io = new Server(server)


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

server.listen(3000, () => {
  console.log('listening on *:3000');
})

io.on('connection', (socket) => {

    console.log(' user connected: ', socket.id)

    socket.on('message', (event) => {
        console.log(event)
        socket.emit('broadcast', event)
    })
})