// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Create two separate Express apps
const app1 = express();
const app2 = express();

// Create HTTP servers for each app
const server1 = http.createServer(app1);
const server2 = http.createServer(app2);

// Create Socket.IO instances that share a Redis adapter
const io1 = new Server(server1, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const io2 = new Server(server2, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app1.use(express.static(path.join(__dirname, 'public')));
app2.use(express.static(path.join(__dirname, 'public')));

// Routes
app1.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app2.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle socket connections for server 1
io1.on('connection', (socket) => {
  console.log('A user connected to server 1');
  
  socket.on('chat message', (msg) => {
    // Broadcast to all clients on server 1
    io1.emit('chat message', msg);
    // Also broadcast to all clients on server 2
    io2.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected from server 1');
  });
});

// Handle socket connections for server 2
io2.on('connection', (socket) => {
  console.log('A user connected to server 2');
  
  socket.on('chat message', (msg) => {
    // Broadcast to all clients on server 2
    io2.emit('chat message', msg);
    // Also broadcast to all clients on server 1
    io1.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected from server 2');
  });
});

// Start servers
const PORT1 = 3000;
const PORT2 = 3001;

server1.listen(PORT1, () => {
  console.log(`Server 1 listening on port ${PORT1}`);
});

server2.listen(PORT2, () => {
  console.log(`Server 2 listening on port ${PORT2}`);
});