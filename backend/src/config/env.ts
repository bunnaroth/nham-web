import dotenv from 'dotenv'; 
import { fileURLToPath } from 'node:url';

dotenv.config({path: fileURLToPath(new URL('../../.env', import.meta.url))});

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

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
        jwtSecret: requiredEnv('JWT_SECRET'),
        refreshTokenSecret: requiredEnv('REFRESH_TOKEN_SECRET')
    }, 
    cors: { 
        clientUrl: process.env.CLIENT_URL as string,
    }
} as const; // immutable 