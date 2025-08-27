import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {prismaClient} from "@repo/db_config/client"
import { hash } from 'crypto';
import { roomSchma, userSchema } from '@repo/common/config';



const secretKey = 'rishabh';


export const register = async(req,res) => {
    try{
    const data = req.body;
    console.log('thsi si data ',data);
    const parsedResp = userSchema.safeParse(data);
    console.log('this is parsed resp ',parsedResp);
    if(!parsedResp.success){
        res.json({
            message: "Invalid Inputs"
        })
        return ;
    }

    const {username,email,password} = data;
    if(!username || !email || !password){
        res.status('504').send('details missing'); 
    }

    const existingUser = await prismaClient.user.findFirst({
        where:{email}
    });
    console.log('existinytg ;user ',existingUser);
    if(existingUser) {
        return res.status(400).json({
            error: "User already existsa"
        })
    }
    //check if email already exists using db query


    //passoword hasing
    const hashedPassword = await bcrypt.hash(password,10);
    console.log('hashed password ',hashedPassword);
    if(!hashedPassword)
        return res.status('503').send('signup failed');

    //make a db query and save user details there
    const user = await prismaClient.user.create({
        data:{
            email:parsedResp.data.email,
            password:hashedPassword,
            uname:parsedResp.data.username
        }
    })
        return res.status(201).json({
        message: "User registered successfully",
        user: { id: user.id, email: user.email, uname: user.uname },
        });
    }catch(error){
        console.log('error is there'); 
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}


export const login = async(req,res)=>{
    const data = req.body;
    const username = data.username;
    const password = data.password;

    //sha password , check validity and move forward
    if(!username || !password)
        return res.json({
            "message":"invalid inputs for login"
    });
    const userCheck = await prismaClient.user.findFirst({
        where:{
            uname: username
        }
    });
    if(!userCheck){
        return res.json({
            message: "no such user exists"
        })
    }
    bcrypt.compare(password,userCheck.password,(err,data)=>{
        if(err){
            return res.json({
                message:"invalid credentails"
            })
        }
        if (data) {
                    const user = {
                        username: username,
                        userId: userCheck.id
                    }

                    const token =  jwt.sign({user},secretKey,{expiresIn: '1h'});
                    console.log('this is token ',token);
                    res.header('Authorisation',token);
                    console.log('after this is token ',token);

                    return res.status(200).json({ user:user,msg: "Login success" })
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }
    })

    
}

export const roomLogin = async(req,res) => {
    console.log('usreId ',req.body);
    const parsedData = roomSchma.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return ;
    }
    console.log(" room login inside try block ",req.user) ;
    const userId = req.user.userId;
    console.log('this is userId ',userId);
    try{
    const room = await prismaClient.room.create({
        data:{
            slug: parsedData.data.name,
            adminId: userId
        }
    })

    res.json({
        roomId: room.id
    })
    return;
    }catch(error){
        console.error(error);
        res.status(411).json({
            message: "room already exists with this name"
        })
    }
}