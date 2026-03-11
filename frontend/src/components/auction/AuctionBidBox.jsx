import { useState } from "react";
import api from "../../lib/axios";

const MIN_INCREMENT=5;

const AuctionBidBox =({auctionId, currentPrice})=>{
    const [amount, setAmount]=useState("");
    const [loading, setLoading]=useState(false);

    const minBid = currentPrice + MIN_INCREMENT;
    const numericAmount = Number(amount);

    const isInvalidBid= !numericAmount || numericAmount<minBid;

    const placeBid=async()=>{
        if (isInvalidBid) return;

        try{
            setLoading(true);
            await api.post("/api/bids/create",{
                auctionId,
                amount:numericAmount
            })
            setAmount("");
        }
        catch(err){ 
            console.error("bid failed",err);
            alert("Bid failed");
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">

            <input type="number" min={minBid} placeholder={`Minimum bid ₹${minBid}`} value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm sm:text-base  focus:outline-none focus:ring-2 focus:ring-amber-400"/>

            {/* {amount && numericAmount < minBid && (
                <p className="text-xs text-red-500">Bid must be at least ₹{minBid}</p>
            )} */}

            <button
                onClick={placeBid}
                disabled={isInvalidBid}
                className="
                w-full py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Placing..." : "Place Bid"}
            </button>

        </div>
    )

}

export default AuctionBidBox;