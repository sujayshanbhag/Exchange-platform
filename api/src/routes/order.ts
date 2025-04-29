import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER, CANCEL_ORDER, ON_RAMP, GET_OPEN_ORDERS } from "../types";
import { z } from "zod";

const createOrderSchema = z.object({
    market: z.string().min(1, "Market cannot be empty"),
    price: z.string()
        .regex(/^\d*\.?\d+$/, "Price must be a valid number")
        .refine((val) => Number(val) > 0, "Price must be positive"),
    quantity: z.string()
        .regex(/^\d*\.?\d+$/, "Quantity must be a valid number")
        .refine((val) => Number(val) > 0, "Quantity must be positive"),
    side: z.enum(["buy", "sell"]),
    userId: z.string()
        .regex(/^\d+$/, "UserId must be a numeric string")
        .min(1, "UserId cannot be empty")
});

// Schema for canceling orders
const cancelOrderSchema = z.object({
    orderId: z.string().min(1, "OrderId cannot be empty"),
    market: z.string().min(1, "Market cannot be empty"),
    userId: z.string()
        .regex(/^\d+$/, "UserId must be a numeric string")
        .min(1, "UserId cannot be empty")
});

// Schema for getting open orders
const openOrdersQuerySchema = z.object({
    userId: z.string()
        .regex(/^\d+$/, "UserId must be a numeric string")
        .min(1, "UserId cannot be empty")
        .optional(),
    market: z.string().min(1, "Market cannot be empty")
});

export const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
    const result = createOrderSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    const { market, price, quantity, side, userId } = result.data;
    
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market,
            price,
            quantity,
            side,
            userId
        }
    });
    res.json(response.payload);
});

orderRouter.delete("/", async (req, res) => {
    const result = cancelOrderSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    const { orderId, market } = result.data;
    
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CANCEL_ORDER,
        data: { orderId, market }
    });
    res.json(response.payload);
});

orderRouter.get("/open", async (req, res) => {
    const result = openOrdersQuerySchema.safeParse(req.query);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    const { userId, market } = result.data;
    
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_OPEN_ORDERS,
        data: { userId, market }
    });
    res.json(response.payload);
});