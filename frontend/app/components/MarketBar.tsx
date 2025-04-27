"use client";
import { useEffect, useState } from "react";
import type { Ticker } from "../utils/types";
import { getTicker } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";

export const MarketBar = ({ market }: { market: string }) => {
    const [ticker, setTicker] = useState<Ticker | null>(null);

    useEffect(() => {
        getTicker(market).then(ticker => setTicker(ticker));
        SignalingManager.getInstance().registerCallback("ticker", (data: Ticker) => setTicker(data), `TICKER-${market}`);
        SignalingManager.getInstance().sendMessage({ "method": "SUBSCRIBE", "params": [`ticker.${market}`] });

        return () => {
            SignalingManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
            SignalingManager.getInstance().sendMessage({ "method": "UNSUBSCRIBE", "params": [`ticker.${market}`] });
        }
    }, [market])
    // 
    
    return <div>
        <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
            <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
                <Ticker market={market} />
                <div className="flex items-center flex-row space-x-8 pl-4">
                    <div className="flex flex-col h-full justify-center">
                        <p className={`font-medium tabular-nums text-greenText text-md text-green-500`}></p>
                        <p className="font-medium text-sm  tabular-nums">{ticker?.price}</p>
                    </div>
                    <div className="invisible flex flex-col">
                        <p className={`font-medium text-xs text-slate-400`}>24H Change</p>
                        <p className={`  font-medium tabular-nums leading-5 text-sm text-greenText ${Number(1) > 0 ? "text-green-500" : "text-red-500"}`}>{Number(1) > 0 ? "+" : ""} {0} {Number(0)?.toFixed(2)}%</p>
                    </div>
                    <div className="invisible flex flex-col">
                        <p className="font-medium text-xs text-slate-400">24H High</p>
                        <p className="text-sm font-medium tabular-nums leading-5 "></p>
                    </div>
                    <div className="invisible flex flex-col">
                        <p className="font-medium text-xs text-slate-400">24H Low</p>
                        <p className="text-sm font-medium tabular-nums leading-5 "></p>
                    </div>
                    <button type="button" className="invisible font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left" data-rac="">
                        <div className="flex flex-col">
                            <p className="font-medium text-xs text-slate-400">24H Volume</p>
                            <p className="mt-1 text-sm font-medium tabular-nums leading-5 "></p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>

}

function Ticker({ market }: { market: string }) {
    return <div className="flex h-[60px] shrink-0 space-x-4">
        <div className="flex flex-row relative ml-2 -mr-4">
            <img alt="SOL Logo" loading="lazy" decoding="async" data-nimg="1" className="z-10 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s" />
            <img alt="USDC Logo" loading="lazy" decoding="async" data-nimg="1" className="h-6 w-6 -ml-2 mt-4 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s" />
        </div>
        <button type="button" className="react-aria-Button" data-rac="">
            <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
                <div className="flex items-center flex-row gap-2 undefined">
                    <div className="flex flex-row relative">
                        <p className="font-medium text-sm undefined">{market.replace("_", " / ")}</p>
                    </div>
                </div>
            </div>
        </button>
    </div>
}