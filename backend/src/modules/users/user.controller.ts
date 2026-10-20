import { Request, Response, NextFunction } from "express"; 
import { UserService } from "./user.service.js";

export const UserController = { 
    async register(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const user = await UserService.registerUser(req.body);

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
            const result = await UserService.loginUser(req.body);

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
            const token = await UserService.refreshAccessToken(req.body?.refreshToken);

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
