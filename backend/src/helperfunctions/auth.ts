import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { Request } from 'express';

import { BadRequestError, UnauthorisedError } from '../middleware/middlewareLogging.js';

export async function hashPassword(password: string): Promise<string> {
    if (!password) {
        throw new BadRequestError("Password is required");
    }

    return await argon2.hash(password);

}

export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    if (!hashedPassword || !plainPassword) {
        throw new BadRequestError("Both hashed and plain passwords are required");
    }

    return await argon2.verify(hashedPassword, plainPassword);
}

export function makeJWT(userId: string, expiresIn: number = 3600, secret: string): string {
    const payload: Payload = {
        iss: "worldstracker",
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(token: string, secret: string): string {
    let validatedJWT;

    try {
        validatedJWT = jwt.verify(token, secret);
    } catch (error) {
        throw new UnauthorisedError(`Invalid token: ${error}`);
    }

    const payload = validatedJWT as JwtPayload;

    if (!payload.sub) {
        throw new UnauthorisedError("Token payload missing sub");
    }

    return payload.sub as string;
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorisedError('Missing Authorization header');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new UnauthorisedError('Invalid Authorization header format');

    }

    return parts[1].trim();
}

export function makeRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
}