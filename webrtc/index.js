const express = require('express')
const http = require('http')

const app = express()

const server = http.createServer(app)

const { Server } = require("socket.io")

const io = new Server(server)


app.use(express.static('public'))


app.get('/', (req, res) => {
    res.send();
})

server.listen(4000, () => {
  console.log('listening on *:4000');
})

function handleRoom(socket, roomName) {

    const room = io.sockets.adapter.rooms.get(roomName)

    const roomSize = room ? room.size : 0

    if(roomSize < 2) {
        socket.join(roomName)
    } else {
        console.log('room is full. current size: ', roomSize)
    }
}

io.on('connection', (socket) => {

    socket.on('join', function(roomName){
        handleRoom(socket, roomName)
    })

    socket.on('offer', function(offer, roomName) {
        console.log(io.sockets.adapter.rooms)
        console.log(' rooom ', roomName)
        console.log('offer recieved. emitting to all clients ...')
        socket.to(roomName).emit('offer', offer)
    })

    socket.on('answer', function(answer, roomName){
        console.log('answer recieved. emitting to all clients ...')
        socket.to(roomName).emit('answer', answer)
    })
})