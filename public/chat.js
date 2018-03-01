// Make client connection
const socket = io.connect('http://localhost:4000')

// Query DOM
const message = document.getElementById('message')
const handle = document.getElementById('handle')
const sendButton = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')

const setFeedback = (handle) => {
  feedback.innerHTML = `<p><em>${handle} is typing a message...</em></p>`
}

const clearFeedback = () => {
  feedback.innerHTML = ''
}

const logChat = (handle, message) => {
  output.innerHTML += `<p><strong>${handle}:</strong> ${message}</p>`
}

// Need a way to clear "is typing..." if it's been a while
let hasTypedRecently = false
const feedbackResetInterval = setInterval(() => {
  if (!hasTypedRecently) {
    clearFeedback()
  }
  hasTypedRecently = false
}, 1000)

// Emit chat events
sendButton.addEventListener('click', () => {
  socket.emit('chat', {
    handle: handle.value,
    message: message.value,
  })
})

// Listen for chat events from the server
socket.on('chat', ({ handle, message }) => {
  clearFeedback()
  logChat(handle, message)
})

// Let the server know when this user is typing
message.addEventListener('keydown', () => {
  socket.emit('typing', handle.value)
})
// On noticing that someone else is typing
socket.on('typing', (handle) => {
  setFeedback(handle)
  hasTypedRecently = true
})

