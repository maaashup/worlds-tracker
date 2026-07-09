import { Request, Response, NextFunction } from 'express';
import { getBearerToken, validateJWT } from '../helperfunctions/auth.js';
import { config } from '../config.js';
import { UnauthorisedError } from './middlewareLogging.js';
import { getDBUserById } from '../db/query/users.js';

export async function middlewareIsLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {
        const token = req.cookies?.token;

        if (!token) {
            throw new UnauthorisedError('Missing or expired authentication token');
        }

	    const userId = validateJWT(token, config.secretKey);

        const user = await getDBUserById(userId);
        if (!user) {
            throw new UnauthorisedError('User not found');
        }

        req.userId = userId;
        req.user = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            isOwner: user.isOwner,
        };
        next();
        
    } catch (error) {
        next(error);
    }
}

