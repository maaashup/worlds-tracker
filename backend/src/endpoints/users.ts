import { Request, Response } from "express";
import { BadRequestError, UnauthorisedError } from "../middleware/middlewareLogging.js";
import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import {createDBUser, getDBUserByUsername, updateDBUser} from "../db/query/users.js";
import { hashPassword, makeJWT, makeRefreshToken, verifyPassword } from "../helperfunctions/auth.js";
import { config } from "../config.js";
import { createDBRefreshToken, getDBRefreshTokenByToken } from "../db/query/refreshTokens.js";
import { revokeDBRefreshToken } from "../db/query/refreshTokens.js";

export async function createUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Missing required fields: username, password");
  }

  const existingUser = await getDBUserByUsername(username);
  if (existingUser) {
    throw new BadRequestError("Username already exists");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await createDBUser({
    username,
    passwordHash: hashedPassword,
  });
  if (!newUser) {
    throw new BadRequestError("Failed to create user");
  }

  respondWithJSON(res, 201, {
    data: { id: newUser.id, username: newUser.username },
  });
}

export async function LoginUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Missing required fields: username, password");
  }

  const existingUser = await getDBUserByUsername(username);
  const validatePassword = await verifyPassword(existingUser.passwordHash,password);

  if (!validatePassword || !existingUser) {
    throw new UnauthorisedError("Invalid password or username");
  }

  const token = makeJWT(existingUser.id, 3600, config.secretKey);
  const refreshToken = makeRefreshToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 2);

  await createDBRefreshToken({
    userId: existingUser.id,
    token: refreshToken,
    expiresAt: expiresAt,
    createdBy: existingUser.username,
    updatedBy: existingUser.username,
  });

  respondWithJSON(res, 200, {
    data: {
      id: existingUser.id,
      username: existingUser.username,
      isAdmin: existingUser.isAdmin,
      token: token,
      refreshToken: refreshToken,
    },
  });
}

export async function updateUserPassword(req: Request, res: Response): Promise<void> {
    const { username, password, newPassword } = req.body;

    if (!username || !password || !newPassword) {
        throw new BadRequestError("Missing required fields: username, password, newPassword");
    }

  if (!req.userId) {
    throw new UnauthorisedError("Invalid access token");
  }

    const existingUser = await getDBUserByUsername(username);
    const validatePassword = await verifyPassword(existingUser.passwordHash, password);

    if (!validatePassword || !existingUser) {
        throw new UnauthorisedError("Invalid password or username");
    }

    if (req.userId !== existingUser.id) {
        throw new UnauthorisedError("User cannot change the password of another user");
    }

    const hashedNewPassword = await hashPassword(newPassword);

    const updatedUser = await updateDBUser(existingUser.id, {
        passwordHash: hashedNewPassword,
        firstLogin: false,
        updatedBy: existingUser.username,
    });

    if (!updatedUser) {
        throw new BadRequestError("Failed to update user");
    }

    respondWithJSON(res, 200, {
        data: {
            id: updatedUser.id,
            username: updatedUser.username,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            updatedBy: updatedUser.updatedBy,
        },

    });

}

export async function logoutUser(req: Request, res: Response): Promise<void> {
  if (!req.refreshToken) {
    throw new UnauthorisedError("Invalid refresh token");
  }

  const storedRefreshToken = await getDBRefreshTokenByToken(req.refreshToken);
  const currentDate = new Date();

  if (!storedRefreshToken || currentDate > storedRefreshToken.expiresAt || !!storedRefreshToken.revokedAt) {
    throw new UnauthorisedError("Invalid refresh token");
  }

  await revokeDBRefreshToken(req.refreshToken, currentDate);

  respondWithJSON(res, 204, {});
}