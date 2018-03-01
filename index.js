const express = require('express')
const socket = require('socket.io')

const app = express()
const server = app.listen(4000, () => {
  console.log('Node server listening on port 4000...')
})

// Static files
app.use(express.static('public'))

// Socket setup
const io = socket(server)

// Make server connection
io.on('connection', (socket) => {
  console.log('made socket connection', socket.id)
  // Listen for chats on this particular socket connection
  socket.on('chat', ({ handle, message }) => {
    // Emit data to all client sockets
    io.sockets.emit('chat', { handle, message })
  })
  // Listen for this socket user to be typing
  socket.on('typing', (handle) => {
    // Emit data to all client sockets but the one that is typing
    socket.broadcast.emit('typing', handle)
  })
})