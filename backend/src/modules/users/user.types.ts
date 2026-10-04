export interface RegisterInput { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
}

export interface  LoginInput { 
    email: string; 
    password: string; 
}

export interface User { 
    id: number; 
    firstName: string; 
    lastName: string; 
    email: string; 
    passwordHash: string; 
}

export interface UserResponse { 
    id: number; 
    firstName: string; 
    lastName: string; 
    email: string;
}