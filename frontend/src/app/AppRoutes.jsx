import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "../auth/ProtectedRoute"
import Home from "../pages/Home"
import Login from "../pages/Login"
import MainLayout from "../components/layout/MainLayout"
import AuctionDetail from "../pages/AuctionDetail"
import CreateAuction from "../pages/CreateAuction"
import MyAuctions from "../pages/MyAuctions"


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={
            <Home/>
          }
        />      
        <Route path='/create-auction' element={
          <ProtectedRoute>
            <CreateAuction/>
          </ProtectedRoute>
          }
        />      
        <Route path='/my-auctions' element={
          <ProtectedRoute>
            <MyAuctions/>
          </ProtectedRoute>
          }
        />      
        <Route path='/auction/:id' element={
            <AuctionDetail/>
          }
        />      
      </Route>      
    </Routes>
  )
}

export default AppRoutes