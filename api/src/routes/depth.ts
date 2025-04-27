import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_DEPTH } from "../types";
import { z } from "zod";

const querySchema = z.object({
    symbol: z.string({
        required_error: "Symbol is required",
        invalid_type_error: "Symbol must be a string"
    }).min(1, "Symbol cannot be empty")
});

export const depthRouter = Router();

depthRouter.get("/", async (req, res) => {
    const result = querySchema.safeParse(req.query);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    try {
        const response = await RedisManager.getInstance().sendAndAwait({
            type: GET_DEPTH,
            data: {
                market: result.data.symbol
            }
        });

        res.json(response.payload);
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});