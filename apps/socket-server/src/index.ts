import express from 'express';
import { createServer } from 'node:http';
import jwt from 'jsonwebtoken'; 
import { Server, Socket } from 'socket.io';
import bcrypt from 'bcrypt';
import {backendConfig} from '@repo/backend-config/config';

import { Queue } from 'bullmq';





interface User {
  ws: Socket,
  roomId: String[],
  userId: String,
}



const app = express();
const server = createServer(app);
const io = new Server(server);

const myQueue = new Queue('chatdb_worker',{ connection: { host: "127.0.0.1", port: 6379 } });



const saveChatToDB = async(data) => {
      console.log('inside savechattodb ',data);
      await myQueue.add('job1',data);
}

const port = 8080; 
const JWT_SECRET = backendConfig.jwtSecret;

const users:User[] = [];

console.log('socket server started');
app.get('/', (req, res) => {
  res.send('socket server running')
});

function validateConnection(socket:Socket) {
    const token = socket.handshake.query?.token;
  // console.log('this is token ',token);
  if(!token){
    socket.disconnect(true);
    return;
  }; 
  // console.log('this is jwt secret ',JWT_SECRET);
  const decode = jwt.verify(token,JWT_SECRET) || ""; 
  console.log('this is decode ',decode);
  if(!decode || decode === "" || !decode.user.userId) {
    socket.disconnect(true); 
    return ;
  }; 
  return decode;
}

io.on('connection', (socket) => {
  // console.log('server connected');
  console.log('socket is ',socket);
  // console.log('a user connected');
  const user = validateConnection(socket);
  if(!user) {
    socket.disconnect(); 
    return ;
  }


  // console.log('decoded data is ',decode);
  socket.on('message',(data)=>{
    console.log('inside message event with data ',data);
    console.log(typeof data);
    const parsedData = JSON.parse(data as unknown as string);
    console.log('parsedData');

    if(parsedData.type === 'join-room'){
      //tasks ===> make a db call to check whether room exists

      socket.join(parsedData.roomId);
      const user = users.find((user) => user.ws === socket);
      if(user) user.roomId.push(parsedData.roomId);
      socket.to(parsedData.roomId).emit('a new user joined');
    }

    if(parsedData.type === 'leave-room'){
      socket.leave('parsedData.roomId');
    }

    if(parsedData.type === 'chat-message') {
      console.log('parsedData chat message ',parsedData);
      const roomId = parsedData.roomId ; 
      const message = parsedData.message;
      socket.to(roomId).emit('chat-message',message);
      saveChatToDB(parsedData);
    }


    // console.log('inside message event'); 
    // console.log('roomName is ',roomName);
    // console.log('message is ',message);
    // io.emit('message',"hello all");
    // const room = rooms.find((room) => room.roomName === roomName);
    // console.log('these are ooms ',rooms);
    // console.log('find room is ',room);
    // if(!room || message.length > 250) return ; 
    // if(!room.chats) room.chats = [];
    // room?.chats.push(message); 
    // console.log('message in rooms ',rooms);
    // socket.to(roomName).emit('chat-message',message);
  });

  // console.log('goint into join-room');
  // socket.on('join-room',()=>{
  //   console.log('decode ',decode);
  //   io.emit('join-room',"welcome ");
  // })
  // console.log('ends');

  // socket.on('create-room',(roomName:String)=>{
  //   const adminId = decode.user.userId;
  //   const roomData = {ws:socket,roomName:roomName,adminId:decode.user.userId,chats:[]};
  //   const checkExistingRooms = rooms.find((item)=>{
  //     if(item.adminId === roomData.adminId && item.roomName ===  roomName){
  //       return item;
  //     }
  //   }); 
  //   if(checkExistingRooms){
  //     return ;
  //   }
  //   rooms.push(roomData);
  //   console.log('room successfully created'); 
  //   console.log(rooms);
  //   console.log('data received for creating-room is ',roomName,adminId);
  // }); 

  // socket.on('join-room',(roomName:string)=>{
  //   const room = rooms.find((room)=>room.roomName === roomName);
  //   if(!room){
  //     return ;
  //   };
  //   console.log('inside join-room');
  //   socket.join(roomName);
  //   socket.emit('join-room',"welcome to the room ");
  // })
});

server.listen(port, () => {
  console.log('server running at http://localhost:8080');
});