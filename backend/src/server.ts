import app from './app.js';
import { env } from './config/env.js'; 
 

app.listen(env.server.port, () => { 
    console.log(`Server is running on port ${env.server.port}`);
})