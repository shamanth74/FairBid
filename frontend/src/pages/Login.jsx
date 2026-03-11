import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { useAuth } from "../auth/useAuth";
import { X } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname ? location.state.from.pathname + (location.state.from.search || "") : "/";
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (isSignup) {
        console.log("Attempting signup with:", { email, name });
        res = await api.post("/api/auth/signup", { email, name });
      } else {
        console.log("Attempting login with:", { email });
        res = await api.post("/api/auth/login", { email });
      }
      console.log("Auth response:", res.data);
      setUser(res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Auth failed:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        baseURL: api.defaults.baseURL,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          baseURL: err.config?.baseURL
        }
      });
      
      let errorMessage = "Authentication failed. Please try again.";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 0) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        className="
          relative w-full max-w-sm
          bg-linear-to-b from-amber-50 to-orange-100
          rounded-2xl shadow-2xl
          p-6 sm:p-8
          flex flex-col items-center gap-6
          animate-fade-in
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close login modal"
          className="
            absolute top-3 right-3 cursor-pointer
            rounded-full p-2
            text-slate-500 hover:text-slate-800
            hover:bg-slate-200/50
            transition
          "
        >
          <X />
        </button>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome to Bid<span className="text-amber-500">Byte</span>
          </h1>
          <p className="text-sm text-slate-600">
            {isSignup ? "Create an account to start bidding" : "Sign in to start bidding"}
          </p>
        </div>

        <div className="w-full h-px bg-slate-200" />

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-4 py-2
                border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-amber-500
                text-slate-800
              "
              placeholder="your@email.com"
            />
          </div>

          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full px-4 py-2
                  border border-slate-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-amber-500
                  text-slate-800
                "
                placeholder="Your name"
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5
              bg-amber-500 hover:bg-amber-600
              text-white font-semibold rounded-lg
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="w-full text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="text-sm text-slate-600 hover:text-slate-800 underline"
          >
            {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 text-center">
          Dev authentication • No passwords required
        </p>
      </div>
    </div>
  );
};

export default Login;
