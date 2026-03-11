import {Worker} from 'bullmq';
import { redis } from '../config/redis.js';
import { io } from '../app.js';
import prisma from '../prisma.js';
import { sendWinnerMail } from '../services/mailer.js';

export const auctionWorker = new Worker(
    "auctionQueue",
    async (job)=>{
        const {auctionId}=job.data;
        const auction=await prisma.auctionItem.findUnique({
            where:{
                id:auctionId
            }
        })
        if (!auction) return;
        if (job.name==="startAuction" && auction.status ==="UPCOMING"){
            await prisma.auctionItem.update({
                where:{ id:auctionId },
                data:{ status:"ACTIVE" }
            })
            io.emit("auction:statusChanged",{
                auctionId,from:"UPCOMING",to:"ACTIVE"
            })
            io.to(`auction_${auctionId}`).emit("auction:started",{ auctionId });
            console.log(`Auction started:${auction.title}`);
        }

        if(job.name==="endAuction" && auction.status==="ACTIVE"){
            const highestBid=await prisma.bid.findFirst({
                where:{auctionId},
                orderBy:{amount:"desc"},
                include:{
                    user:true
                }
            })
            await prisma.auctionItem.update({
                where:{id:auctionId},
                data:{status:"CLOSED"}
            })
            io.emit("auction:statusChanged",{
                auctionId,from:"ACTIVE",to:"CLOSED"
            })
            io.to(`auction_${auctionId}`).emit("auction:ended",{
                auctionId,
                winner:highestBid
            })
            if (highestBid?.user.email) {
                try {
                    await sendWinnerMail({
                        to: highestBid.user.email,
                        name:highestBid.user.name || "",
                        title:auction.title,
                        amount: highestBid.amount,
                    });
                    console.log("Winner email sent");
                } 
                catch (err) {
                    console.error("Failed to send winner email", err);
                }
            }

            console.log(`Auction ended:${auction.title}`);
            console.log("Auction winner:",highestBid);
        }
    },
    {connection:redis}
)