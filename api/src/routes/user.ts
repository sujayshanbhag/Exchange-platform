import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_BALANCE, OFF_RAMP, ON_RAMP } from "../types";
import { z } from "zod";

const rampSchema = z.object({
    userId: z.string()
        .regex(/^\d+$/, "UserId must be a numeric string")
        .min(1, "UserId cannot be empty"),
    amount: z.string()
        .regex(/^\d*\.?\d+$/, "Amount must be a valid number")
        .refine((val) => Number(val) > 0, "Amount must be positive")
});

const balanceQuerySchema = z.object({
    userId: z.string()
        .regex(/^\d+$/, "UserId must be a numeric string")
        .min(1, "UserId cannot be empty")
});

export const userRouter = Router();

userRouter.post("/on-ramp", async (req, res) => {
    const result = rampSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    const response = await RedisManager.getInstance().sendAndAwait({
        type: ON_RAMP,
        data: {
            userId: result.data.userId,
            amount: result.data.amount,
            txnId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
    });
    res.json(response.payload);
});

userRouter.post("/off-ramp", async (req, res) => {
    const result = rampSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    const response = await RedisManager.getInstance().sendAndAwait({
        type: OFF_RAMP,
        data: {
            userId: result.data.userId,
            amount: result.data.amount,
            txnId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
    });
    res.json(response.payload);
});

userRouter.get("/balance", async (req, res) => {
    const result = balanceQuerySchema.safeParse(req.query);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_BALANCE,
        data: {
            userId: result.data.userId
        }
    });
    res.json(response.payload);
});