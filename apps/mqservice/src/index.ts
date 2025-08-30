import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import {prismaClient} from "@repo/db_config/client"


const connection = new IORedis({ maxRetriesPerRequest: null}); 
const chats = [];

const userId = '8a4484ce-9da2-474c-812c-032412f98148';
const worker = new Worker(
    'chatdb_worker',
    async job => {
        const message = job.data.message;
        // const roomId = 'rishabh-room-01' || job.data.roomId;
        const roomId = 1 ;
        const chat = await prismaClient.chat.create({
            data:{
                message:message,
                roomId:roomId,
                userId:userId
            }
        });
        console.log('chat is chat',chat);
        console.log('jobdata is ',job.data);
    },
    {connection}
);

worker.on('completed', job => {
  console.log(`${job.data} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job?.data} has failed with ${err.message}`);
});
