import { UserModel } from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput, UserResponse } from "./user.types.js";
import { env } from "../../config/env.js";
import {
    badRequest,
    validateNonEmptyString,
    validateObject,
    validatePositiveInteger,
} from "../../utils/validation.js";

const SALT_ROUNDS = 12; 
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: unknown): asserts email is string {
    validateNonEmptyString(email, "Email");
    if (!EMAIL_PATTERN.test(email)) {
        badRequest("Email must be a valid email address.");
    }
}

function validateRegistrationPassword(password: unknown): asserts password is string {
    validateNonEmptyString(password, "Password");

    const byteLength = Buffer.byteLength(password, "utf8");
    if (
        byteLength < 8 ||
        byteLength > 72 ||
        !/\p{L}/u.test(password) ||
        !/\p{N}/u.test(password)
    ) {
        badRequest("Password must be 8 to 72 bytes and contain a letter and a number.");
    }
}

export const UserService = { 

    async registerUser(input: RegisterInput): Promise<UserResponse> { 
        validateObject(input);
        validateNonEmptyString(input.firstName, "First name");
        validateNonEmptyString(input.lastName, "Last name");
        validateEmail(input.email);
        validateRegistrationPassword(input.password);

        const user = await UserModel.findByEmail(input.email); 

        if(user) { 
            const error: any = new Error('An account with this email already exists.'); 
            error.status = 409; 
            throw error; 
        } 

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS); 

        const createdUser = await UserModel.create({ 
            ...input, 
            password: hashedPassword
        }); 

        return { 
            id: createdUser.id, 
            firstName: createdUser.firstName, 
            lastName: createdUser.lastName, 
            email: createdUser.email
        };
    }, 


    async loginUser(input: LoginInput): Promise<{token: string; refreshToken: string; user: UserResponse}> { 
        validateObject(input);
        validateEmail(input.email);
        validateNonEmptyString(input.password, "Password");

        const user = await UserModel.findByEmail(input.email); 

        if(!user) { 
            const error: any = new Error('Invalid email or password.'); 
            error.status = 401; 
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash); 
        if (!isPasswordValid) { 
            const error: any = new Error('Invalid email or password.'); 
            error.status = 401; 
            throw error;
        }

        const token = jwt.sign( 
            { id: user.id, email: user.email}, 
            env.auth.jwtSecret, 
            { expiresIn: '15min'}
        ); 


        const refreshToken = jwt.sign( 
            { id: user.id}, 
            env.auth.refreshTokenSecret, 
            { expiresIn: '30d'}
        ); 


        return { 
            token,
            refreshToken, 
            user: { 
                id: user.id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email
            }
        }; 
    }, 


    async refreshAccessToken(refreshToken: unknown): Promise<string> {
        validateNonEmptyString(refreshToken, "Refresh token");

        try { 
            const decoded = jwt.verify( 
                refreshToken,
                env.auth.refreshTokenSecret
            );

            if (typeof decoded === "string") {
                badRequest("Refresh token must contain a valid user ID.");
            }
            validatePositiveInteger(decoded.id, "User ID");

            const user = await UserModel.findById(decoded.id); 

            if (!user) { 
                const error: any = new Error("User not found."); 
                error.status = 401; 
                throw error; 
            }

            const token = jwt.sign( 
                { 
                    id: user.id, 
                    email: user.email, 
                }, 

                env.auth.jwtSecret, 
                { 
                    expiresIn: "15min"
                }
            ); 

            return token; 
        } catch (error) { 
            if (error instanceof jwt.JsonWebTokenError) { 
                const jwtError: any = new Error( 
                    'Invalid or expired refresh token.'
                ); 

                jwtError.status = 401; 
                throw jwtError;
            }

            throw error; 
        } 
    } 
}