import pg from 'pg'; 
import {env} from './env.js';; 

const { Pool } = pg; 

export const pool = new Pool({ 
    host: env.db.host, 
    port: env.db.port, 
    database: env.db.name, 
    user: env.db.user, 
    password: env.db.password,
}); 



