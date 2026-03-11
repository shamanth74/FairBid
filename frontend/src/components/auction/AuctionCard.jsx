import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

const getRemainingTimeParts = (endTime) => {
  const diff = Math.max(0, new Date(endTime) - new Date());

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds };
};


const AuctionCard = ({auction}) => {
  const navigate=useNavigate();
  const { id, title, imageUrl,startPrice, currentPrice, startTime, endTime, status }=auction;

  const [remaining, setRemaining]= useState(()=> getRemainingTimeParts(endTime));

  useEffect(()=>{
    if(status!=="ACTIVE") return;
    if(remaining.totalSeconds >300) return;

    const interval=setInterval(()=>{
      setRemaining(getRemainingTimeParts(endTime));
    },1000);

    return ()=> clearInterval(interval);
  },[remaining.totalSeconds, endTime, status]);

  return (
    <div onClick={() => navigate(`/auction/${id}`)} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="h-36 sm:h-40 md:h-44 bg-slate-200">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-1">{title}</h3>

        {status === "UPCOMING" && (
          <div className="flex items-center justify-between text-xs sm:text:sm">
            <span className="text-slate-500">Base Price</span>
            <span className="font-semibold text-slate-800">₹{startPrice}</span>
          </div>
        )}

        {status === "ACTIVE" && (
          <div className="flex items-center justify-between text-xs sm:text:sm">
            <span className="text-slate-500">Current Bid</span>
            <span className="font-semibold text-slate-800">₹{currentPrice}</span>
          </div>
        )}

        {status === "CLOSED" && (
          <div className="flex items-center justify-between text-xs sm:text:sm">
            <span className="text-slate-500">Closed Bid</span>
            <span className="font-semibold text-slate-800">₹{currentPrice}</span>
          </div>
        )}

        {status ==="ACTIVE" && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-600">
            <Clock size={14}/>
            <span>
              {remaining.totalSeconds <= 0
                ? "Ended"
                : remaining.totalSeconds > 300
                ? `Ends in ${remaining.days ? `${remaining.days}d ` : ""}${remaining.hours ? `${remaining.hours}h ` : ""}${remaining.minutes}m`
                : `Ending in ${remaining.minutes}m ${remaining.seconds}s`}
            </span>

          </div>
        )}
        {status=="UPCOMING" && (
          <p className="text-xs sm:text-sm text-slate-500">
            Starts at {new Date(startTime).toLocaleString()}
          </p>
        )}
        {status === "CLOSED" && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-green-600">
            <CheckCircle size={14} />
            <span>Auction closed</span>
          </div>
        )}

      </div>
    </div>
  )
}

export default AuctionCard