import { useEffect, useState } from "react";
import api from "../lib/axios";
import Spinner from "../components/ui/Spinner";
import AuctionCard from "../components/auction/AuctionCard";

const MyAuctions=()=>{
    const [auctions, setAuctions]=useState([]);
    const [loading, setLoading]=useState(true);

    useEffect(()=>{
        const fetchMyAuctions=async ()=>{
            try{
                const res=await api.get("/api/auctions/mine");
                console.log("✅ Fetched my auctions:", res.data);
                // Backend returns array directly, not wrapped in { auctions: [...] }
                const auctionsData = Array.isArray(res.data) ? res.data : (res.data?.auctions || []);
                setAuctions(auctionsData);
            }
            catch(err){
                console.error("❌ Failed to fetch my auctions", err);
                setAuctions([]);
            }
            finally{
                setLoading(false);
            }
        }

        fetchMyAuctions();
    },[]);

    return(
        <div className="w-full px-4 py-6 mx-auto ">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    My Auctions
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Auctions you've created
                </p>
            </div>

            {loading?(
                <Spinner/>
            ): auctions.length===0 ? (
                <p className="text-center text-slate-500">
                    You haven't created any auctions yet.
                </p>
            ):(
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {auctions.map((auction)=>(
                        <AuctionCard key={auction.id} auction={auction}/>
                    ))}
                </div>
            )}
        </div>
    )
}
export default MyAuctions;