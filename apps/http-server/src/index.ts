import  express from 'express'; 

const app = express(); 

const port = 4000;

app.get('/',(req,res)=>{
    res.send(`server running on port  ${port}`);
})

app.listen(port,()=>{
    console.log('server started');
})