import { OAuth2Client} from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

export const googleAuthService=async(idToken)=>{
    if(!idToken){
        throw new Error("Token ID Missing");
    }
    const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket=await client.verifyIdToken({
        idToken,
        audience:process.env.GOOGLE_CLIENT_ID
    })

    const payload=ticket.getPayload();
    
    let user=await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })
    if(!user){
        user=await prisma.user.create({
            data:{
                name:payload.name,
                email:payload.email,
                avatarUrl:payload.picture,
                provider: "google"
            }
        })
    }

    const token = jwt.sign(
        {userId:user.id},
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )

    return { token, user };
}

export const getAuthUserService=async(userId)=>{
    const user=await prisma.user.findUnique({
        where:{id:userId},
        select:{
            id:true,
            name:true,
            email:true,
            avatarUrl:true
        }
    })
    if(!user){
        throw new Error("User not found");
    }
    return user;
}