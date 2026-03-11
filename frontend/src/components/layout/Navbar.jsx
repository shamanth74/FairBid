import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth"
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const { user, logout,loading } = useAuth();
    const [open, setOpen] = useState(false);
    const location=useLocation();
    return (
        <nav className="sticky w-full   top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-slate-800">
                        Bid<span className="text-amber-500">Byte</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {loading? null:user ? (
                            <>
                                <Link className="text-slate-600 hover:text-slate-900" to="/create-auction">Create Auction</Link>
                                <Link className="text-slate-600 hover:text-slate-900" to="/my-auctions">My Auctions</Link>
                                <button onClick={logout} className="px-4 py-2 rounded-lg bg-amber-500 font-bold text-white hover:bg-amber-600 transition">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" state={{from:location}} className="px-4 py-2 rounded-lg bg-amber-500 font-bold text-white hover:bg-amber-600 transition" >
                                Login
                            </Link>
                        )}
                    </div>
                    <div className="md:hidden">
                        {loading?null:user ? (
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition"
                            >
                                {open ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        ) : (
                            <Link to="/login" state={{from:location}} className="text-sm font-medium text-amber-600">
                                Login
                            </Link>
                        )}
                    </div>

                </div>
            </div>
            {user && open && (
                <div className="md:hidden w-full absolute bg-white border-t border-slate-200 shadow-sm">
                    <div className="flex flex-col px-4 py-3 gap-3">
                        <Link
                            to="/create-auction"
                            onClick={() => setOpen(false)}
                            className="text-slate-700 font-medium hover:text-slate-900"
                        >
                            Create Auction
                        </Link>

                        <Link
                            to="/my-auctions"
                            onClick={() => setOpen(false)}
                            className="text-slate-700 font-medium hover:text-slate-900"
                        >
                            My Auctions
                        </Link>

                        <button
                            onClick={() => {
                                setOpen(false);
                                logout();
                            }}
                            className="mt-2 w-full px-4 py-2 rounded-lg bg-amber-500 font-bold text-white hover:bg-amber-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

        </nav>
    )
}
export default Navbar;