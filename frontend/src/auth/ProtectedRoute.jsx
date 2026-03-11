import { Navigate } from "react-router-dom"
import Spinner from "../components/ui/Spinner"
import { useAuth } from "./useAuth"

const ProtectedRoute=({children})=>{
    const { loading, isAuthenticated }=useAuth()

    if(loading){
        return <Spinner/>
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace ></Navigate>
    }
    return children;
}

export default ProtectedRoute;