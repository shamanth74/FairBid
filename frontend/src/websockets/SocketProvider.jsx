import { useEffect } from "react";
import { socket } from "../lib/socket";
import { queryClient } from "../lib/reactQuery";


const SocketProvider = ({ children }) => {
  useEffect(() => {

    socket.on("auction:created", ({ status }) => {
      const normalizedStatus = status.toLowerCase();
      //   if (!status) {
      //     queryClient.invalidateQueries({ queryKey: ["auctions"] });
      //     return;
      //   }
      queryClient.invalidateQueries({
        queryKey: ["auctions", normalizedStatus],
      });
    });
    socket.on("bidPlaced:changes", ({ auctionId, newPrice }) => {
      queryClient.setQueryData(["auctions", "active"], (old) => {
        if (!old) return old;

        return old.map((auction) =>
          auction.id === auctionId
            ? { ...auction, currentPrice: newPrice }
            : auction
        );
      });
      queryClient.setQueryData(["auction", auctionId], (prev) => {
        
      return prev ? { ...prev, currentPrice:newPrice } : prev
            
      });
    });

    socket.on("auction:statusChanged", ({ from, to }) => {

      const normalFrom = from.toLowerCase();
      const normalTo = to.toLowerCase();

      if (normalFrom) {
        queryClient.invalidateQueries({
          queryKey: ["auctions", normalFrom],
        });
      }

      if (normalTo) {
        queryClient.invalidateQueries({
          queryKey: ["auctions", normalTo],
        });
      }
    });

    socket.on("auction:deleted", () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["my-auctions"] });
    });

    return () => {
      socket.off("auction:created");
      socket.off("auction:statusChanged");
      socket.off("auction:deleted");
      socket.off("bidPlaced:changes");
    };
  }, []);

  return children;
};

export default SocketProvider;
