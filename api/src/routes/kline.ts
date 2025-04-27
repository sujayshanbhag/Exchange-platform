import { Client } from 'pg';
import { Router } from "express";
import { z } from "zod";

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});
pgClient.connect();

const intervalEnum = z.enum(['1m', '1h', '1w']);

const querySchema = z.object({
    symbol: z.string().min(1, "Market cannot be empty"),
    interval: intervalEnum,
    startTime: z.string().transform((val) => new Date(Number(val) * 1000)),
    endTime: z.string().transform((val) => new Date(Number(val) * 1000))
});

export const klineRouter = Router();

klineRouter.get("/", async (req, res) => {
    const result = querySchema.safeParse(req.query);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.errors
        });
    }

    const { symbol, interval, startTime, endTime } = result.data;

    let query;
    switch (interval) {
        case '1m':
            query = `SELECT * FROM klines_1h WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1h':
            query = `SELECT * FROM klines_1h WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1w':
            query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2`;
            break;
        default:
            return res.status(400).send('Invalid interval');
    }

    try {
        const result = await pgClient.query(query, [startTime, endTime]);
        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});