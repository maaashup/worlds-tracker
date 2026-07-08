import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorisedError } from "../middleware/middlewareLogging.js";
import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import {createDBUser, getDBUserById, getDBUserByUsername, updateDBUser} from "../db/query/users.js";
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
  if (!existingUser) {
      throw new UnauthorisedError("Invalid username");
    }


  const validatePassword = await verifyPassword(existingUser.passwordHash,password);

  if (!validatePassword) {
    throw new UnauthorisedError("Invalid password");
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

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600 * 1000, // 1 hour
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
  });

  respondWithJSON(res, 200, {
    data: {
      id: existingUser.id,
      username: existingUser.username,
      isAdmin: existingUser.isAdmin,
      isOwner: existingUser.isOwner,
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

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new UnauthorisedError("Invalid refresh token");
  }

  const storedRefreshToken = await getDBRefreshTokenByToken(refreshToken);
  const currentDate = new Date();

  if (!storedRefreshToken || currentDate > storedRefreshToken.expiresAt || !!storedRefreshToken.revokedAt) {
    throw new UnauthorisedError("Invalid refresh token");
  }

  await revokeDBRefreshToken(refreshToken, currentDate);

  const CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  }

  res.clearCookie("token", CookieOptions);
  res.clearCookie("refreshToken", CookieOptions);

  respondWithJSON(res, 204, {});
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    throw new NotFoundError("User session not found");
  }

  const user = await getDBUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  respondWithJSON(res, 200, {
    data: {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      isOwner: user.isOwner,
    },
  });
}