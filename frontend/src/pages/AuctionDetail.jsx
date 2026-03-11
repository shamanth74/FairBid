import { useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios.js"
import Spinner from "../components/ui/Spinner.jsx"
import AuctionCountdown from "../components/auction/AuctionCountdown.jsx";
import AuctionBidBox from "../components/auction/AuctionBidBox";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../auth/useAuth.js";
import { socket } from "../lib/socket.js";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/reactQuery.js";
import toast from "react-hot-toast";

const fetchAuction = async ({ queryKey }) => {
    const [, id] = queryKey;
    const res = await api.get(`/api/auctions/${id}`);
    return res.data;
};

const AuctionDetail = () => {
    const [locallyEnded, setLocallyEnded] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { id } = useParams();

    const { data: auction, isLoading } = useQuery({
        queryKey: ["auction", id],
        queryFn: fetchAuction,
        enabled: !!id,
    });

    useEffect(() => {
        if (!id) return;

        socket.emit("auction:join", id);

        const handleBidPlaced = (data) => {
            if (data.auctionId === id) {
                queryClient.setQueryData(["auction", id], (prev) =>
                    prev ? { ...prev, currentPrice: data.newPrice } : prev
                );
            }
        };

        const handleAuctionStarted = (data) => {
            if (data.auctionId === id) {
                queryClient.setQueryData(["auction", id], (prev) =>
                    prev ? { ...prev, status: "ACTIVE" } : prev
                );
            }
        };

        const handleAuctionEnded = (data) => {
            console.log("auction ended")
            if (data.auctionId === id) {
                queryClient.setQueryData(["auction", id], (prev) =>
                    prev ? { ...prev, status: "CLOSED" } : prev
                );
            }
        };
        const handleBidStatus = (data) => {

            if (data.auctionId === id) {

                if (data.type === "OUTBID") {
                    toast.error("You've been outbid");
                }

                if (data.type === "HIGHEST") {
                    toast.success("You're the highest bidder");
                }
            }
        }

        socket.on("bid:placed", handleBidPlaced);
        socket.on("bid:status", handleBidStatus);
        socket.on("auction:started", handleAuctionStarted);
        socket.on("auction:ended", handleAuctionEnded);

        return () => {
            socket.emit("auction:leave", id);
            socket.off("bid:placed", handleBidPlaced);
            socket.off("auction:started", handleAuctionStarted);
            socket.off("auction:ended", handleAuctionEnded);
            socket.off("bid:status", handleBidStatus);
        };
    }, [id]);


    if (isLoading) {
        return <Spinner />;
    }

    if (!auction) {
        return (
            <div className="p-6 text-center text-slate-500">
                Auction not found
            </div>
        );
    }

    const { title, imageUrl, currentPrice, startPrice, startTime, endTime, status, sellerId } = auction;

    return (
        <div className="w-full px-4 py-6 space-y-6 max-w-3xl mx-auto">

            <div className="w-full h-56 sm:h-64 bg-slate-200 rounded-xl overflow-hidden">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            </div>

            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h1>
                <p className="text-sm text-slate-500 capitalize">Status:
                    {status === "UPCOMING" && (<span className="text-blue-500">{status.toLowerCase()}</span>)}
                    {status === "ACTIVE" && (<span className="text-green-500">{status.toLowerCase()}</span>)}
                    {status === "CLOSED" && (<span className="text-red-500">{status.toLowerCase()}</span>)}

                </p>
            </div>

            <div className="bg-white rounded-xl flex items-center justify-between p-4 pr-6 shadow-sm">
                <div>
                    {status === "ACTIVE" && (
                        <p className="text-slate-500 text-sm">Current Bid</p>
                    )}
                    {status === "UPCOMING" && (
                        <p className="text-slate-500 text-sm">Base Price</p>
                    )}
                    {status === "CLOSED" && (
                        <p className="text-slate-500 text-sm">Closed Bid</p>
                    )}
                    <p className="text-3xl font-bold text-slate-800">₹{currentPrice}</p>
                </div>

                {status === "CLOSED" && <div className="text-center">
                    {currentPrice - startPrice === 0 && <h2 className="text-red-700 font-bold">UNSOLD</h2>}
                    {currentPrice - startPrice > 0 && <h2 className="text-green-700 text-lg font-bold">SOLD</h2>}
                </div>}

            </div>

            <AuctionCountdown endTime={endTime} status={status} onEnd={() => setLocallyEnded(true)} />

            {isAuthenticated && !locallyEnded && status === "ACTIVE" && sellerId !== user.id && <AuctionBidBox auctionId={id} currentPrice={currentPrice} />}

            {status === "UPCOMING" && (
                <p className="text-center text-slate-500">
                    Starts at {new Date(startTime).toLocaleString()}
                </p>
            )}

            {!isAuthenticated && status === "ACTIVE" && (
                <p className="text-center font-medium text-amber-700">Login to start bidding</p>
            )}

            {status === "CLOSED" && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle size={16} />
                    <span className="font-medium">Auction closed</span>
                </div>
            )}

        </div>
    )
}

export default AuctionDetail;