import { createAuctionService, getActiveAuctionsService, getAuctionByIdService, getClosedAuctionsService, getMyAuctionsService, getUpcomingAuctionsService } from "../services/auction.service.js";

export const createAuction = async (req,res)=>{
    try{
        const data=req.body;
        const userId=req.user.userId;
        const result=await createAuctionService(data,userId);
        return res.status(201).json(result);
    }
    catch(error){
        console.error("Create Auction Error:",error);
        return res.status(400).json({error:error.message})
    }
}

export const getActiveAuctions= async (req,res)=>{
    try{
        const result=await getActiveAuctionsService();
        return res.status(200).json(result);
    }
    catch(error){
        console.error("Get Active Auction Error:",error);
        return res.status(500).json({error:error.message})
    }
}
export const getUpcomingAuctions= async (req,res)=>{
    try{
        const result=await getUpcomingAuctionsService();
        return res.status(200).json(result);
    }
    catch(error){
        console.error("Get Upcoming Auction Error:",error);
        return res.status(500).json({error:error.message})
    }
}
export const getClosedAuctions= async (req,res)=>{
    try{
        const result=await getClosedAuctionsService();
        return res.status(200).json(result);
    }
    catch(error){
        console.error("Get Closed Auction Error:",error);
        return res.status(500).json({error:error.message});
    }
}
export const getAuctionById=async(req,res)=>{
    try{
        const id=req.params.id;
        if(!id){
            return res.status(400).json({error:"AuctionId not found"});
        }
        const result=await getAuctionByIdService(id);
        return res.status(200).json(result);
    }
    catch(error){
        console.log("Get Auction By Id Error:",error)
        return res.status(500).json({error:error.message})
    }
}
export const getMyAuctions=async(req,res)=>{
    try{
        const {userId}=req.user;
        if(!userId){
            return res.status(400).json({error:"User not logged in"});
        }
        const result=await getMyAuctionsService(userId);
        return res.status(200).json(result);
    }
    catch(error){
        console.log("Get My Auctions Error:",error);
        return res.status(500).json({error:error.message})
    }
}

    
