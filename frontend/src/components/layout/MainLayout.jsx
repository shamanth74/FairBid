import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import PageContainer from "./PageContainer"
import { Toaster } from "react-hot-toast"

const MainLayout = () => {
  return (
    <div className="h-dvh overflow-hidden flex flex-col  bg-slate-100">
        <Navbar/>
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
        <main className="flex-1 overflow-y-auto ">
            {/* <PageContainer > */}
                <Outlet/>
            {/* </PageContainer> */}
        </main>
    </div>
  )
}

export default MainLayout
