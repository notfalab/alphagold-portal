// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Aurora from "../components/Aurora";

export default function LoginPage() {
    const router = useRouter();
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const callback = await signIn("credentials", {
            ...data,
            redirect: false,
        });

        if (callback?.error) {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden bg-black">

            <div className="absolute inset-0 z-0">
                <Aurora
                    colorStops={["#000000", "#B8860B", "#FFD700"]}
                    blend={0.6}
                    amplitude={1.0}
                    speed={0.3}
                />
            </div>

            <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative z-10">

                {/* LOGO AREA (Texto eliminado) */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <img
                        src="/logo.png"
                        alt="AlphaGold Logo"
                        className="h-28 w-auto object-contain mb-2 drop-shadow-[0_0_25px_rgba(234,179,8,0.7)]"
                    />
                    {/* H1 Eliminado */}
                    <p className="text-gray-400 text-sm uppercase tracking-wide mt-2">Member Access</p>
                </div>

                <form onSubmit={loginUser} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-yellow-500 focus:outline-none focus:bg-white/10 transition"
                            placeholder="name@example.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-yellow-500 focus:outline-none focus:bg-white/10 transition"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded border border-red-500/20 animate-pulse">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold uppercase tracking-wider shadow-[0_5px_15px_rgba(234,179,8,0.3)] hover:shadow-[0_5px_25px_rgba(234,179,8,0.5)] transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Enter Dashboard"}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    New here?{" "}
                    <Link href="/register" className="text-yellow-500 hover:text-yellow-400 font-semibold transition hover:underline">
                        Create an Account
                    </Link>
                </p>
            </div>
        </div>
    );
}