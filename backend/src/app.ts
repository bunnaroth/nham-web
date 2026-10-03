import express from 'express'; 
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express(); 

app.use(cors({
    origin: env.cors.clientUrl, 
    credentials: true
})); 

app.use(express.json());  
app.use(express.urlencoded({extended: true})); 

app.use(errorHandler); 


export default app; 