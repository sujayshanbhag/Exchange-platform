"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "../../utils/SignalingManager";
import { Ticker } from "@/app/utils/types";

export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("ticker", (data: Ticker) => setPrice(data.price), `TICKER-${market}`);
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            setBids((originalBids) => {
                const bidsAfterUpdate = [...(originalBids || [])];

                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < data.bids.length; j++)  {
                        if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                            bidsAfterUpdate[i][1] = data.bids[j][1];
                            if (Number(bidsAfterUpdate[i][1]) === 0) {
                                bidsAfterUpdate.splice(i, 1);
                            }
                            break;
                        }
                    }
                }

                for (let j = 0; j < data.bids.length; j++)  {
                    if (Number(data.bids[j][1]) !== 0 && !bidsAfterUpdate.map(x => x[0]).includes(data.bids[j][0])) {
                        bidsAfterUpdate.push(data.bids[j]);
                        break;
                    }
                }
                bidsAfterUpdate.sort((x, y) => Number(y[0]) - Number(x[0]));
                return bidsAfterUpdate; 
            });

            setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];

                for (let i = 0; i < asksAfterUpdate.length; i++) {
                    for (let j = 0; j < data.asks.length; j++)  {
                        if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                            asksAfterUpdate[i][1] = data.asks[j][1];
                            if (Number(asksAfterUpdate[i][1]) === 0) {
                                asksAfterUpdate.splice(i, 1);
                            }
                            break;
                        }
                    }
                }

                for (let j = 0; j < data.asks.length; j++)  {
                    if (Number(data.asks[j][1]) !== 0 && !asksAfterUpdate.map(x => x[0]).includes(data.asks[j][0])) {
                        asksAfterUpdate.push(data.asks[j]);
                        break;
                    }
                }
                asksAfterUpdate.sort((x, y) => Number(y[0]) - Number(x[0]));
                return asksAfterUpdate; 
            });
        }, `DEPTH-${market}`);
        
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth@${market}`]});

        getDepth(market).then(d => {    
            setBids(d.bids);
            setAsks(d.asks);
        });

        getTicker(market).then(t => setPrice(t.price));
        //getTrades(market).then(t => setPrice(t[0].price));

        return () => {
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            SignalingManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth@${market}`]});
            SignalingManager.getInstance().sendMessage({ "method": "UNSUBSCRIBE", "params": [`ticker.${market}`] });
        }
    }, [])
    
    return <div>
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div>{price}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-slate-500">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}