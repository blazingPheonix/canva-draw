import express from 'express';
import { createServer } from 'node:http';
import jwt from 'jsonwebtoken'; 
import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import {backendConfig} from '@repo/backend-config/config';

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 8080; 
const JWT_SECRET = backendConfig.jwtSecret;

console.log('socket server started');
app.get('/', (req, res) => {
  res.send('socket server running')
});

io.on('connection', (socket) => {
  console.log('server connected');
  console.log('socket is ',socket);
  console.log('a user connected');

  const token = socket.handshake.query?.token;
  if(!token){
    socket.disconnect(true);
    return;
  }
  const decode = jwt.verify(token,JWT_SECRET) || ""; 
  if(!decode || decode === "" || !decode.userId) {
    socket.disconnect(true); 
    return ;
  }

  socket.on('message',()=>{
    io.emit('message',"hello all");
  })

});

server.listen(port, () => {
  console.log('server running at http://localhost:8080');
});