import AuctionCard from "./AuctionCard";

const AuctionGrid = ({ auctions = [], loading, status }) => {
  if (loading) {
    return (
      <div className="text-center text-slate-500 mt-20">
        Loading auctions...
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center text-slate-500 mt-20">
        No {status} auctions available
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
};

export default AuctionGrid;
