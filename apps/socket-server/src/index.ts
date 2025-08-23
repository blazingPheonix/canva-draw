import express from 'express';
import { createServer } from 'node:http';


import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 8080; 

app.get('/', (req, res) => {
  res.send('socket server running')
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log('server running at http://localhost:3000');
});