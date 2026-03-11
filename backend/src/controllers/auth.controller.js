import { getAuthUserService, googleAuthService } from "../services/auth.service.js";


export const googleAuth= async (req,res)=>{
    try{
        const { idToken }=req.body;
        const { token, user} =await googleAuthService(idToken);

        res.cookie("token", token, {
        httpOnly: true,
        secure: true,  
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000  
        });

        res.status(200).json({user});
    }
    catch(error){
        console.error("Auth Error:",error);
        res.status(401).json({ error:error.message });
    }
}
export const logoutUser = (req,res)=>{
    try{
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token","",{
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            expires: new Date(0),
            path: "/"
        })
        res.status(200).json({ message: "Logged out successfully"})
        console.log("Logout successfully");
    }
    catch(error){
        console.error("Logout Error:",error);
        res.status(401).json({ error:error.message });
    }
    
}

export const getAuthUser= async(req,res)=>{
    try{
        const { userId }=req.user;
        const result=await getAuthUserService(userId);
        res.status(200).json(result)
    }
    catch(error){
        console.error("error:",error);
        res.status(401).json({error:error.message})
    }

}