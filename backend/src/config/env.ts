import dotenv from 'dotenv'; 
import path from 'path'; 

// load .env file from root directory
dotenv.config({path: path.resolve(process.cwd(), '.env')}); 

export const env = { 
    server: { 
        port: parseInt(process.env.PORT as string, 10), 
    }, 
    db: { 
        host: process.env.DB_HOST as string, 
        port: parseInt(process.env.DB_PORT as string, 10), 
        name: process.env.DB_NAME as string, 
        user: process.env.DB_USER as string, 
        password: process.env.DB_PASSWORD as string,
    }, 

    auth: { 
        jwtSecret: process.env.JWT_SECRET as string,
    }, 
    cors: { 
        clientUrl: process.env.CLIENT_URL as string,
    }
} as const; // immutable 