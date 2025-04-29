import { CANCEL_ORDER, CREATE_ORDER, GET_BALANCE, GET_DEPTH, GET_OPEN_ORDERS, GET_TICKER, ON_RAMP, OFF_RAMP } from "."

export type MessageToEngine = {
    type: typeof CREATE_ORDER,
    data: {
        market: string,
        price: string,
        quantity: string,
        side: "buy" | "sell",
        userId: string
    }
} | {
    type: typeof CANCEL_ORDER,
    data: {
        orderId: string,
        market: string,
    }
} | {
    type: typeof ON_RAMP,
    data: {
        amount: string,
        userId: string,
        txnId: string,
    }
} | {
    type: typeof OFF_RAMP,
    data: {
        amount: string,
        userId: string,
        txnId: string,
    }
} | {
    type: typeof GET_DEPTH,
    data: {
        market: string,
    }
} | {
    type: typeof GET_OPEN_ORDERS,
    data: {
        userId?: string,
        market: string,
    }
} | {
    type: typeof GET_TICKER,
} | {
    type: typeof GET_BALANCE,
    data: {
        userId: string
    }
}