import { placeBidService } from "../services/bid.service.js";

export const placeBid= async(req,res)=>{
    try{
        const { amount, auctionId }=req.body;
        const { userId }=req.user;
        if(!amount || !auctionId){
            return res.status(400).json({error:"Required fields are missing"});
        }
        if(!userId){
            return res.status(400).json({error:"User not logged in"});
        }
        const numericAmount=Number(amount);
        if(Number.isNaN(numericAmount) || numericAmount<=0){
            return res.status(400).json({error:"Amount must be a positive number"});
        }
        await placeBidService({ amount:numericAmount, userId, auctionId});
        return res.status(201).json({
            success:true,
            message: "Bid placed successfully",
        })
    }
    catch(error){
        console.error("Place Bid Error:",error);
        if (error.code==="BID_VALIDATION")
            return res.status(400).json({error:error.message});
        return res.status(500).json({error:error.message});
    }
}