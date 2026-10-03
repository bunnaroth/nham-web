import express from 'express'; 
import cors from 'cors'; 
import { env } from './config/env.js'; 

const app = express(); 

app.use(cors({
    origin: env.cors.clientUrl, 
    credentials: true
})); 

app.listen(env.server.port, () => { 
    console.log(`Server is running on port ${env.server.port}`);
})