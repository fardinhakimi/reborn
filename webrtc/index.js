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


const ROOM_NAME = 'rtc_room'



function handleRoom(socket) {

    const room = io.sockets.adapter.rooms.get(ROOM_NAME)

    const roomSize = room ? room.size : 0

    if(roomSize < 2) {
        socket.join(ROOM_NAME)
    } else {
        console.log('room is full. current size: ', roomSize)
    }
}

io.on('connection', (socket) => {
    handleRoom(socket)

    socket.on('offer', function(offer) {
        console.log('offer recieved. emitting to all clients ...')
        socket.to(ROOM_NAME).emit('offer', offer)
    })

    socket.on('answer', function(answer){
        console.log('answer recieved. emitting to all clients ...')
        socket.to(ROOM_NAME).emit('answer', answer)
    })
})