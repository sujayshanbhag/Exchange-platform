import axios from "axios";

const BASE_URL = "http://localhost:3000";
const MARKET = "TATA_INR";

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    const openOrders = await axios.get(`${BASE_URL}/api/v1/order/open?market=${MARKET}`);
    console.log("Open Orders:", openOrders.data);

    if (openOrders.data.length > 0) {
        const buyOrders = openOrders.data.filter((o: any) => o.side === "buy");
        const sellOrders = openOrders.data.filter((o: any) => o.side === "sell");

        // Find the lowest buy price and the lowest sell price
        const lowestBuy = buyOrders.length > 0 ? Math.min(...buyOrders.map((o: any) => parseFloat(o.price))) : null;
        const highestSell = sellOrders.length > 0 ? Math.max(...sellOrders.map((o: any) => parseFloat(o.price))) : null;
        console.log("Lowest Buy Price:", lowestBuy);
        console.log("Lowest Sell Price:", highestSell);

        if (lowestBuy !== null) {
            const randomSubtract = getRandomNumber(1, Math.min(lowestBuy, 999));
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (lowestBuy - randomSubtract).toString(),
                quantity: getRandomNumber(1, 10).toString(),
                side: "sell",
                userId: getRandomNumber(1, 10).toString(),
            });
            console.log(`Created sell order at price: ${(lowestBuy - randomSubtract).toFixed(1)}`);
        }
        if (highestSell !== null) {
            const randomAdd = getRandomNumber(1, 999);
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (highestSell + randomAdd).toString(),
                quantity: getRandomNumber(1, 10).toString(),
                side: "buy",
                userId: getRandomNumber(1, 10).toString(),
            });
            console.log(`Created buy order at price: ${(highestSell + randomAdd).toFixed(1)}`);
        }
    } else {
        console.log("No open orders found. Creating 5 buy and 5 sell orders...");

        // Create 5 buy orders
        for (let i = 0; i < 5; i++) {
            const randomPrice = getRandomNumber(2000, 5000);
            const randomQuantity = getRandomNumber(1, 10);
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: randomPrice.toFixed(1).toString(),
                quantity: randomQuantity.toString(),
                side: "buy",
                userId: getRandomNumber(1, 10).toString(),
            });
            console.log(`Created buy order at price: ${randomPrice}, quantity: ${randomQuantity}`);
        }

        // Create 5 sell orders
        for (let i = 0; i < 5; i++) {
            const randomPrice = getRandomNumber(2000, 5000);
            const randomQuantity = getRandomNumber(1, 10);
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: randomPrice.toFixed(1).toString(),
                quantity: randomQuantity.toString(),
                side: "sell",
                userId: getRandomNumber(1, 10).toString(),
            });
            console.log(`Created sell order at price: ${randomPrice}, quantity: ${randomQuantity}`);
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    main();
}

main();