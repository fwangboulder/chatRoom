const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the "join" event to capture the username
  socket.on('join', (username) => {
    // Broadcast a welcome message with the username
    socket.broadcast.emit('chat message', { username, message: 'joined the chat' });
  });

  // Listen for chat messages
  socket.on('chat message', (data) => {
    // Broadcast the message along with the username
    io.emit('chat message', data);
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
