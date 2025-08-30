import  express from 'express'; 
import {backendConfig} from '@repo/backend-config/config';
import { authRouter } from './routes/authRoute';
import { prismaClient } from '@repo/db_config/client';

const app = express(); 

app.use(express.json());

app.use('/api/v1/auth',authRouter);

const port = 4000;



app.get('/',(req,res)=>{
    res.send(`server running on port  ${port}`);
})

app.get('/chats/:roomId',async(req,res) => {
    try{
    const roomId  = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take:50

    });
    return res.status(200).json({
        message: "chat fetched successfully",
        data:messages
    })
        }catch(error){
            return res.status(501).json({
                info: "error in fetching chat details",
                message:error
            })
        }
    
})
app.listen(port,()=>{
    console.log('server started');
})