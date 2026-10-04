import { Request, Response, NextFunction } from "express"; 
import { UserService } from "./user.service.js";
import { stat } from "node:fs";

export const UserController = { 
    async register(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const { firstName, lastName, email, password} = req.body; 

            if (!firstName || !lastName || !email || !password) { 
                res.status(400).json({status: 'error', message: "All fields are required."}); 
                return; 
            }

            const user = await UserService.registerUser({firstName, lastName, email, password: password}); 

            res.status(201).json({ 
                status: 'success', 
                message: 'User registered successfully.', 
                data: {user}
            }); 
        } catch ( error) { 
            next(error); 
        }
    }, 

    async login(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const { email, password} = req.body; 

            if(!email || !password) { 
                res.status(400).json({status: 'error', message: 'Email and password are required.'}); 
                return; 
            }

            const result = await UserService.loginUser({ 
                email, 
                password: password
            }); 

            res.status(200).json({ 
                status: 'success', 
                message: 'Authentication successful.',
                data: result
            }); 
        } catch (error) { 
            next(error); 
        }
    }, 

    async refresh(req: Request, res:Response, next: NextFunction): Promise<void> { 
        try { 
            const { refreshToken } = req.body; 

            if ( !refreshToken) { 
                res.status(400).json({ 
                    status: 'error', 
                    message: 'Refresh token is required.'
                }); 
                return; 
            }

            const token = await UserService.refreshAccessToken(refreshToken); 

            res.status(200).json({ 
                status: 'success', 
                message: 'Authentication successful.', 
                data: { token }
            }); 
        } catch ( error) { 
            next(error);
        }
    }
}; 
