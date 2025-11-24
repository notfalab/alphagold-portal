// app/dashboard/BuyButton.tsx
"use client";

import { useState } from "react";

export default function BuyButton() {
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/checkout", {
                method: "POST",
            });
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error("Payment error", error);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_35px_rgba(234,179,8,0.6)] transition transform hover:scale-[1.02] disabled:opacity-50"
        >
            {/* CAMBIO AQUÍ: Texto actualizado a $97 */}
            {loading ? "Processing..." : "Activate Membership ($97/mo)"}
        </button>
    );
}