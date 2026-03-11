import { useNavigate } from "react-router-dom"
import api from "../lib/axios";
import { useState } from "react";

const CreateAuction = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "", description: "", imageUrl: "", startPrice: "", startTime: "", endTime: ""
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const now = new Date();
        const start = new Date(form.startTime);
        const end = new Date(form.endTime);

        // if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        //     setError("Please select valid start and end times");
        //     return;
        // }

        if (start <= now) {
            setError("Start time must be in the future");
            return;
        }

        // if (end <= start) {
        //     setError("End time must be after start time");
        //     return;
        // }

        const MIN_DURATION_MINUTES = 5;
        const durationMinutes = (end - start) / (1000 * 60);

        if (durationMinutes < MIN_DURATION_MINUTES) {
            setError(`Auction must last at least ${MIN_DURATION_MINUTES} minutes`);
            return;
        }
        try {
            setLoading(true);

            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                imageUrl: form.imageUrl.trim(),
                startPrice: Number(form.startPrice),
                startTime: new Date(form.startTime).toISOString(),
                endTime: new Date(form.endTime).toISOString()
            }

            const res = await api.post("/api/auctions/create", payload);

            const auctionId = res.data.id;
            navigate(`/auction/${auctionId}`, { replace: true });
        }
        catch (err) {
            console.error("Creating auction failed:", err);
            setError(err.response?.data?.error || "Something went wrong while creating the auction");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="w-full px-4 py-6 max-w-xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Create Auction</h1>
                <p className="text-slate-500 text-sm mt-1">
                    List an item and start accepting bids
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4">

                <div>
                    <label className="test-sm font-medium text-slate-600">Title</label>
                    <input name="title" value={form.title} onChange={handleChange} required className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-black/26 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-600">Description</label>
                    <textarea name="description" onChange={handleChange} rows={3} placeholder="Brief description of the item" className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-black/26 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400"></textarea>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-600">Image URL</label>
                    <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required placeholder="https://example.com/image.jpg" className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-black/26 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-600">Start Price (₹)</label>
                    <input type="number" name="startPrice" value={form.startPrice} onChange={handleChange} required min={1} className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-black/26 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-600">Start Time</label>
                    <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-black/26 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-600">End Time</label>
                    <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-black/26 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <button type="submit" disabled={loading} className="w-full py-2 rounded-lg mt-2 font-bold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-50">
                    {loading ? "Creating Auction..." : "Create Auction"}
                </button>

            </form>
        </div>
    )
}

export default CreateAuction