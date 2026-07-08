import { Request, Response, NextFunction } from 'express';
import { getBearerToken, validateJWT } from '../helperfunctions/auth.js';
import { config } from '../config.js';
import { UnauthorisedError } from './middlewareLogging.js';

export function middlewareIsLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {
        const token = req.cookies?.token;

        if (!token) {
            throw new UnauthorisedError('Missing or expired authentication token');
        }

	    const userId = validateJWT(token, config.secretKey);

        req.userId = userId;
        next();
        
    } catch (error) {
        next(error);
    }
}

