import { Request, Response } from "express";
import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { readProducts } from "../db/query/selectProductData.js";

export async function getProductData(req: Request, res: Response) {
    const result = await readProducts();

    respondWithJSON(res, 200, result);

}