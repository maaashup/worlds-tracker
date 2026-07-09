import { Router } from "express";

import { createUser, getCurrentUser, LoginUser, logoutUser, updateUserPassword } from "../endpoints/users.js";
import { middlewareIsLoggedIn } from "../middleware/middlewareIsLoggedIn.js";
import { middlewareIsValidRefreshToken } from "../middleware/middlewareIsValidRefreshToken.js";
import { middlewareRequireAdmin } from "../middleware/middlewareRequireAdmin.js";

export const usersRoutes = Router();

usersRoutes.post("/login", LoginUser);
usersRoutes.post("/logout", middlewareIsValidRefreshToken, logoutUser);

usersRoutes.use(middlewareIsLoggedIn);

usersRoutes.post("/create", middlewareRequireAdmin, createUser);
usersRoutes.put("/update", updateUserPassword);
usersRoutes.get("/current", getCurrentUser);