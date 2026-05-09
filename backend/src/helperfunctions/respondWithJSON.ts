import { Request, Response, NextFunction } from "express";

export function respondWithJSON(res: Response, code: number, payload: any) {
    res.header("Content-Type", "application/json");
    res.status(code).json(payload);
}