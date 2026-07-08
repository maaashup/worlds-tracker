import { Router } from "express";

import { refreshToken, revokeToken } from "../endpoints/tokens.js";
import { middlewareIsValidRefreshToken } from "../middleware/middlewareIsValidRefreshToken.js";

export const tokensRoutes = Router();

tokensRoutes.post("/refresh", middlewareIsValidRefreshToken, refreshToken);
tokensRoutes.post("/revoke", middlewareIsValidRefreshToken, revokeToken);