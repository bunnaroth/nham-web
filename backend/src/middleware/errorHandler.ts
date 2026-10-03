import { ErrorRequestHandler } from "express";
import { env } from '../config/env.js'; 

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => { 
    const statusCode = err.status || 500; 

    console.error(`Error ${req.method} ${req.url} - ${err.message}`); 

    if (err.stack) { 
        console.error(err.stack); 
    }

    // format response 
    res.status(statusCode).json({ 
        status: 'error', 
        message: err.message || 'An unexpected internal server error.', 
    });
};