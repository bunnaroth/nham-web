import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'; 
import { env } from "../config/env.js";

declare global { 
    namespace Express { 
        interface Request { 
            user?: { 
                id: number; 
                email: string;
            }; 
        }
    }
}


export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => { 

    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith('Bearer')) { 
        res.status(401).json({message: 'Authentication failed.'}); 
        return; 
    }


    const token = authHeader.split(' ')[1]; 

    if (!token) { 
        res.status(401).json({message: 'Authentication failed.'}); 
        return; 
    }

    try { 
        const decoded = jwt.verify(token, env.auth.jwtSecret) as unknown as { id: number; email: string};

        req.user = { 
            id: decoded.id, 
            email: decoded.email
        }; 

        next(); 
    } catch (error) { 
        res.status(403).json({message: 'Authenticate failed.'}); 
        return; 
    }
}; 
