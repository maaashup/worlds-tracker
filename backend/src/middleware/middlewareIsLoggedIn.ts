import { Request, Response, NextFunction } from 'express';
import { getBearerToken, validateJWT } from '../helperfunctions/auth.js';
import { config } from '../config.js';

export function middlewareIsLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {
        const token = getBearerToken(req);
	    const userId = validateJWT(token, config.secretKey);

        req.userId = userId;
        next();
    } catch (error) {
        next(error);
    }
}

