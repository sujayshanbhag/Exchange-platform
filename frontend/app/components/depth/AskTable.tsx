
export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 15);
    relevantAsks.reverse();
    const asksWithTotal: [string, string, number][] = relevantAsks.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    asksWithTotal.reverse();

    return <div>
        {asksWithTotal.map(([price, quantity, total]) => <Ask maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total} />)}
    </div>
}


function Ask({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                width: "100%",
                backgroundColor: "transparent",
                overflow: "hidden",
                fontVariantNumeric: "tabular-nums", // Ensures digits align properly
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${(100 * total) / maxTotal}%`,
                    height: "100%",
                    background: "rgba(228, 75, 68, 0.325)",
                    transition: "width 0.3s ease-in-out",
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
