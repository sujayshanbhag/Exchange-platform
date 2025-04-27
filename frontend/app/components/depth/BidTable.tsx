
export const BidTable = ({ bids }: {bids: [string, string][]}) => {
    let currentTotal = 0; 
    const relevantBids = bids.slice(0, 15);
    const bidsWithTotal: [string, string, number][] = relevantBids.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return <div>
        {bidsWithTotal?.map(([price, quantity, total]) => <Bid maxTotal={maxTotal} total={total} key={price} price={price} quantity={quantity} />)}
    </div>
}

function Bid({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                width: "100%",
                backgroundColor: "transparent",
                overflow: "hidden",
                fontVariantNumeric: "tabular-nums", // Ensures numbers align properly
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${(100 * total) / maxTotal}%`,
                    height: "100%",
                    background: "rgba(1, 167, 129, 0.325)",
                    transition: "width 1s ease-in-out",
                }}
            ></div>
            <div className="flex w-full text-xs">
                <div style={{ minWidth: "80px", textAlign: "left", paddingRight: "8px" }}>
                    {price}
                </div>
                <div style={{ minWidth: "80px", textAlign: "center", paddingRight: "8px" }}>
                    {quantity}
                </div>
                <div style={{ minWidth: "80px", textAlign: "right" }}>
                    {total.toFixed(2)}
                </div>
            </div>
        </div>
    );
}

