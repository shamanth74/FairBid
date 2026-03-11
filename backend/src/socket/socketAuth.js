import cookie from "cookie";
import jwt from "jsonwebtoken";
export const socketAuth=(socket,next)=>{
    try{
        socket.user=null;
        const rawCookie=socket.handshake.headers.cookie;
        if(!rawCookie){
            return next();
        }

        const parsedCookies=cookie.parse(rawCookie);
        const token=parsedCookies.token;

        if(!token){
            return next();
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        socket.user={
            id:decoded.userId
        }

        next();
    }
    catch(err){
        console.error("Socket auth failed:",err);
        next(new Error(err));
    }
}