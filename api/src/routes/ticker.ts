import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_TICKER } from "../types";
import { z } from "zod";

const querySchema = z.object({
    symbol: z.string({
        required_error: "Symbol is required",
        invalid_type_error: "Symbol must be a string"
    }).min(1, "Symbol cannot be empty")
});

export const tickersRouter = Router();

tickersRouter.get("/", async (req, res) => {

    try {
        const response = await RedisManager.getInstance().sendAndAwait({
            type: GET_TICKER,
        });
    
        res.json(response.payload);
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});