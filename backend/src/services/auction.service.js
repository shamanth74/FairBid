import { io } from "../app.js";
import prisma from "../prisma.js";
import { auctionQueue } from "../queues/auction.queue.js";
export const createAuctionService= async (data,userId)=>{
    const { title, description, imageUrl, startPrice, startTime, endTime } = data;
    const sellerId=userId;

    if (!title || !description || !imageUrl || !startPrice || !startTime || !endTime) 
        throw new Error("Missing required fields");
    if (!sellerId){
        throw new Error("User not logged in");
    }
    
    const auction=await prisma.auctionItem.create({
        data:{
            title,
            description,
            imageUrl,
            startPrice,
            currentPrice:startPrice,
            startTime:new Date(startTime),
            endTime:new Date(endTime),
            sellerId,
            status:"UPCOMING"
        }
    })
    io.emit("auction:created",{
        status:auction.status
    })
    const now=Date.now();
    const startDelay=new Date(startTime).getTime()-now;
    const endDelay=new Date(endTime).getTime()-now;

    await auctionQueue.add("startAuction",
        {auctionId:auction.id},
        { delay:startDelay>0?startDelay:0}
    )
    await auctionQueue.add("endAuction",
        {auctionId:auction.id},
        { delay:endDelay>0?endDelay:0}
    )

    return auction;
}

export const getActiveAuctionsService=async ()=>{
    return prisma.auctionItem.findMany({
        where:{
            status:"ACTIVE"
        },
        orderBy:{
            endTime:"asc"
        }
    })
}
export const getUpcomingAuctionsService=async ()=>{
    return prisma.auctionItem.findMany({
        where:{
            status:"UPCOMING"
        },
        orderBy:{
            startTime:"asc"
        }
    })
}
export const getClosedAuctionsService=async ()=>{
    return prisma.auctionItem.findMany({
        where:{
            status:"CLOSED"
        },
        orderBy:{
            endTime:"desc"
        }
    })
}
export const getAuctionByIdService=async(id)=>{
    return prisma.auctionItem.findUnique({
        where:{
            id
        },
        include:{
            bids:{
                orderBy:{createdAt:"desc"},
                include:{
                    user:true
                }
            },
            seller:true
        }
    })
}
export const getMyAuctionsService=async(userId)=>{
    return prisma.auctionItem.findMany({
        where:{
            sellerId:userId
        },
        orderBy:{
            createdAt:"desc"
        }
    })
}