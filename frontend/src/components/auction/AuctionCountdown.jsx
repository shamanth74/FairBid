import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getRemainingTimeParts } from "../../utils/countdown";


const AuctionCountdown = ({ endTime, status, onEnd }) => {
    const [remaining, setRemaining] = useState(() =>
        getRemainingTimeParts(endTime)
    )

    useEffect(() => {
        if (status !== "ACTIVE") return;
        // if (remaining.totalSeconds > 300) return;

        const interval = setInterval(() => {
            const next = getRemainingTimeParts(endTime);
            setRemaining(next);

            if (next.totalSeconds <= 0) {
                onEnd();             
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [remaining.totalSeconds, endTime, status]);

    if (status !== "ACTIVE") return null;

    if (remaining.totalSeconds <= 0) {
        return (
            <p className="text-sm sm:text-base text-slate-500">
                Finalizing auction…
            </p>
        );
    }

    return (
        <div className="flex items-center gap-2 text-amber-600 text-sm sm:text-base">
            <Clock size={16} />
            <span className="font-medium">
                {remaining.days? `Ending in ${remaining.days}d ${remaining.hours}h  ${remaining.minutes}m ${remaining.seconds}s`:remaining.hours? 
                 `Ending in ${remaining.hours}h  ${remaining.minutes}m ${remaining.seconds}s` :
                  `Ending in   ${remaining.minutes}m ${remaining.seconds}s`}
                    {/* ? `Ends in ${remaining.days
                        ? `${remaining.days}d `
                        : remaining.hours
                            ? `${remaining.hours}h `
                            : ""
                    }${remaining.minutes}m`
                    : `Ending in ${remaining.days}d ${remaining.hours}h  ${remaining.minutes}m ${remaining.seconds}s`} */}
            </span>
        </div>
    )
}

export default AuctionCountdown;