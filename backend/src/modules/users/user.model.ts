import { pool } from "../../config/db.js";
import { RegisterInput, User } from "./user.types.js";

export const UserModel = { 

    async findByEmail(email: string): Promise<User | null> { 
        const query = `
        SELECT 
            id, 
            first_name AS "firstName", 
            last_name AS "last_name", 
            email, 
            password_hash as "passwordHash", 
            created_at as "createdAt"
        FROM users 
        WHERE email = $1`;
        
        const result = await pool.query<User>(query, [email]) ; 

        return result.rows[0] || null; 
    }, 

    async findById(id: number): Promise<User | null> { 
        const query = 'SELECT * FROM users WHERE id = $1'; 
        const result = await pool.query<User>(query, [id]); 

        return result.rows[0] || null;
    }, 

    async create(user: RegisterInput): Promise<User> { 
        const client = await pool.connect(); 
        try { 
            await client.query('BEGIN'); 

            const query = `
                INSERT INTO users (first_name, last_name, email, password_hash)
                VALUES ($1, $2, $3, $4) 
                RETURNING *
            `; 

            const values = [user.firstName, user.lastName, user.email, user.password]; 

            const result = await client.query<User>(query, values); 

            const newUser = result.rows[0];

            if (!newUser) { 
                throw new Error('Failed to create user.')
            }
            
            await client.query('INSERT INTO carts (user_id) VALUES ($1)', [newUser.id]); 

            await client.query('COMMIT'); 
            return newUser; 
        } catch (error) { 
            await client.query('ROLLBACK'); 
            throw error;
        } finally { 
            client.release(); 
        }
    }
}; 
