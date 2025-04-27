"use client";
import { useEffect, useState } from "react";
import { createOrder } from "../utils/httpClient";
import { useUserContext } from "../context/UserContext";

export function SwapUI({ market }: { market: string }) {
    const [activeTab, setActiveTab] = useState("buy");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { userId, balance, updateBalance} = useUserContext();

    useEffect(() => {
        updateBalance()
    },[])

    const handleCreateOrder = async () => {
        try {
            const orderResponse = await createOrder(market, quantity, price, activeTab, userId);
            console.log("Order Created Successfully:", orderResponse);
            updateBalance();
        } catch (error) {
            console.error("Failed to create order:", error);
        }
    };

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex flex-row h-[60px]">
                    <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col pt-3 px-3">
                        <div className="flex flex-col flex-1 gap-3 text-baseTextHighEmphasis">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between flex-row">
                                    <p className="text-xs font-normal text-baseTextMedEmphasis">Available Balance</p>
                                    <p className="font-medium text-xs text-baseTextHighEmphasis">{balance}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-normal text-baseTextMedEmphasis">Price</p>
                                <div className="flex flex-col relative">
                                    <input
                                        step="1"
                                        placeholder="0"
                                        className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-[var(--background)] pr-2 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-normal text-baseTextMedEmphasis">Quantity</p>
                            <div className="flex flex-col relative">
                                <input
                                    step="1"
                                    placeholder="0"
                                    className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-[var(--background)] pr-2 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="flex justify-end flex-row">
                                <p className="font-medium pr-2 text-xs text-baseTextMedEmphasis">≈ {quantity * price} INR</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className={`font-semibold focus:ring-blue-200 focus:none focus:outline-none text-center h-12 rounded-xl text-base px-4 py-2 my-4 ${activeTab === "buy" ? "bg-greenPrimaryButtonBackground" : "bg-redPrimaryButtonBackground"
                                } text-greenPrimaryButtonText active:scale-98`}
                            onClick={handleCreateOrder}
                        >
                            {activeTab === "buy" ? "Buy" : "Sell"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BuyButton({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
    return (
        <div
            className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === "buy" ? "border-b-greenBorder bg-greenBackgroundTransparent" : "border-b-baseBorderMed hover:border-b-baseBorderFocus"
                }`}
            onClick={() => setActiveTab("buy")}
        >
            <p className="text-center text-sm font-semibold text-greenText">Buy</p>
        </div>
    );
}

function SellButton({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
    return (
        <div
            className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === "sell" ? "border-b-redBorder bg-redBackgroundTransparent" : "border-b-baseBorderMed hover:border-b-baseBorderFocus"
                }`}
            onClick={() => setActiveTab("sell")}
        >
            <p className="text-center text-sm font-semibold text-redText">Sell</p>
        </div>
    );
}
