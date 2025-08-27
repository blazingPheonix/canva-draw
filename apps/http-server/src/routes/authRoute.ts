import express, { Router } from "express";
import { authenticate } from "../utils/middleware";
import { login, register, roomLogin } from "../controllers/auth";

export const authRouter: Router = express.Router(); 

authRouter.post('/register',register);

authRouter.post('/login',login);

authRouter.post('/createRoom',authenticate,roomLogin);

