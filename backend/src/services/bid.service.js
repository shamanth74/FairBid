import prisma from "../prisma.js";
import { io } from "../app.js";

const MIN_BID_INCREMENT = 5;

const ValidationError = (message) => {
  const err = new Error(message);
  err.code = "BID_VALIDATION";
  return err;
};

const placeBidTransaction = async (tx, { amount, userId, auctionId }) => {
  const previousHighest = await tx.bid.findFirst({
    where: { auctionId },
    orderBy: { amount: "desc" },
    select: { userId: true },
  });
  const auction = await tx.auctionItem.findUnique({
    where: { id: auctionId },
  });

  if (!auction) throw ValidationError("Auction not found");
  if (auction.status === "UPCOMING")
    throw ValidationError("Auction has not started yet");
  if (auction.status === "CLOSED")
    throw ValidationError("Auction has already ended");
  if (auction.sellerId === userId)
    throw ValidationError("You cannot bid on your own auction");

  const minAllowed = auction.currentPrice + MIN_BID_INCREMENT;
  if (amount < minAllowed) {
    throw ValidationError(`Bid must be at least ₹${minAllowed}`);
  }

  const updated = await tx.auctionItem.updateMany({
    where: {
      id: auctionId,
      currentPrice: { lt: amount },
    },
    data: { currentPrice: amount },
  });

  if (updated.count === 0) {
    throw ValidationError(
      "You have been outbid by another user. Please refresh and try again."
    );
  }

  const bid = await tx.bid.create({
    data: {
      amount,
      userId,
      auctionId,
    },
    select: {
      id: true,
      amount: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    bid,
    previousHighestUserId: previousHighest?.userId ?? null,
  };
};

const broadcastBidEvents = ({
  bid,
  auctionId,
  userId,
  previousHighestUserId,
}) => {

  io.to(`auction_${auctionId}`).emit("bid:placed", {
    auctionId,
    newPrice: bid.amount,
    highestBid: bid,
    highestBidder: bid.user.name,
  });

  io.emit("bidPlaced:changes",{
    auctionId,
    newPrice:bid.amount
  })
  if (previousHighestUserId && previousHighestUserId !== userId) {
    io.to(`user_${previousHighestUserId}`).emit("bid:status", {
      type: "OUTBID",
      auctionId,
    });
  }

  io.to(`user_${userId}`).emit("bid:status", {
    type: "HIGHEST",
    auctionId,
  });
};


export const placeBidService = async ({ amount, userId, auctionId }) => {

  const result = await prisma.$transaction((tx) =>
    placeBidTransaction(tx, { amount, userId, auctionId })
  );

  broadcastBidEvents({
    bid: result.bid,
    auctionId,
    userId,
    previousHighestUserId: result.previousHighestUserId,
  });


  return result;
};
