import { createContext, useContext, useEffect, useState } from "react";
import api from '../lib/axios.js';
import { useNavigate } from "react-router-dom";

const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [loading, setLoading]=useState(true);

    useEffect( ()=>{
        const fetchme =async()=>{
            try{
                const res=await api.get("/api/auth/me");
                // console.log(res.data);
                setUser(res.data);
            }
            catch(error){
                setUser(null);
            }
            finally{
                setLoading(false);
            }
            
        }
        fetchme();
    },[])

    const logout=async()=>{
        try{
            await api.post("/api/auth/logout");
        }
        catch(error){
            console.error("Logout failed",error); 
        }
        finally{
            setUser(null)
        }
    }

    return(
        <AuthContext.Provider 
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
    
}
export const useAuthContext =()=> useContext(AuthContext);