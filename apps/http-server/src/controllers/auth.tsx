import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const secretKey = 'rishabh';


const register = async(req,res) => {
    const data = req.body;
    const {username,email,password} = data.body;
    if(!username || !email || !password){
        res.status('504').send('details missing'); 
    }

    //check if email already exists using db query


    //passoword hasing
    const hashedPassword = await bcrypt.hash(password,10);
    console.log('hashed password ',hashedPassword);
    if(!hashedPassword)
        return res.status('503').send('signup failed');

    //make a db query and save user details there
}


const login = (req,res)=>{
    const data = req.body;
    const username = data.username;
    const password = data.password;

    //sha password , check validity and move forward



    const user = {
        username: username,
        message: "logged in"
    }

    const token = jwt.sign({user},secretKey,{expiresIn: '1h'});
    res.header('Authorisation',token).send(user);
}