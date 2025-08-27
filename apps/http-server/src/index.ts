import  express from 'express'; 
import {backendConfig} from '@repo/backend-config/config';
import { authRouter } from './routes/authRoute';

const app = express(); 

app.use(express.json());

app.use('/api/v1/auth',authRouter);

const port = 4000;



app.get('/',(req,res)=>{
    res.send(`server running on port  ${port}`);
})

app.listen(port,()=>{
    console.log('server started');
})