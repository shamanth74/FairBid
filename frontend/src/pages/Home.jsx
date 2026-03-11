import api from "../lib/axios.js"
import AuctionGrid from "../components/auction/AuctionGrid.jsx";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
const TABS=["active","upcoming","closed"];

const fetchAuctions = async ({ queryKey }) => {
  const [, status] = queryKey;
  try {
    const res = await api.get(`/api/auctions/${status}`);
    console.log(`✅ Fetched ${status} auctions:`, res.data);
    // Backend returns array directly, so res.data is the array
    return res.data;
  } catch (error) {
    console.error(`❌ Error fetching ${status} auctions:`, error);
    throw error;
  }
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("tab") || "active";
  const setStatus = (tab) => {
    setSearchParams({ tab });
  };

  const {
    data: auctions = [],
    isLoading
  } = useQuery({
    queryKey: ["auctions", status],
    queryFn: fetchAuctions, 
  });

  // Ensure auctions is an array
  const auctionsList = Array.isArray(auctions) ? auctions : (auctions?.data || []);

  return (
    <div className=" w-full  px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Auctions</h1>
        <p className="text-slate-500 mt-1">Bid live or explore what's next</p>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((tab)=>(
          <button key={tab} onClick={()=>setStatus(tab)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize
              transition whitespace-nowrap
              ${
                status === tab
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
                {tab}
          </button>
        ))}
      </div>
      <AuctionGrid auctions={auctionsList} loading={isLoading} status={status} />
    </div>
  )
}

export default Home