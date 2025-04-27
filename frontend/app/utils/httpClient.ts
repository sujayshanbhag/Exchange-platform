import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

// const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";
const BASE_URL = "http://localhost:3000/api/v1";

export async function getTicker(market: string): Promise<Ticker> {
    const tickers = await getTickers();
    const ticker = tickers?.find(t => t.symbol === market);
    if (!ticker) {
        throw new Error(`No ticker found for ${market}`);
    }
    return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
    const response = await axios.get(`${BASE_URL}/tickers`);
    return response.data;
}


export async function getDepth(market: string): Promise<Depth> {
    const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
    return response.data;
}
export async function getTrades(market: string): Promise<Trade[]> {
    const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
    return response.data;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    const response = await axios.get(`${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    const data: KLine[] = response.data;
    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function createOrder(market: string, quantity: Number, price : Number, side: string, userId: Number) {
    try {
        const response = await axios.post(`${BASE_URL}/order`, {
            market: market,
            price: price.toString(),
            quantity: quantity.toString(),
            side: side,
            userId: userId.toString(),
        });

        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error; 
    }
}

export async function getUserBalance(userId: Number) {
    try{
        const response = await axios.get(`${BASE_URL}/user/balance?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting balance:", error);
        throw error; 
    }
}

export async function onRamp(userId: Number, amount: Number) {
    try {
        const response = await axios.post(`${BASE_URL}/user/on-ramp`,{
            userId: userId.toString(),
            amount: amount
        })
        return response.data;
    } catch (error) {
        console.error("Error completing deposit:", error);
        throw error; 
    }
}

export async function offRamp(userId: Number, amount: Number) {
    try {
        const response = await axios.post(`${BASE_URL}/user/off-ramp`,{
            userId: userId.toString(),
            amount: amount
        })
        return response.data;
    } catch (error) {
        console.error("Error completing withdrawal:", error);
        throw error; 
    }
}