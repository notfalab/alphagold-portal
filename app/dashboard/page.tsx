// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BuyButton from "./BuyButton";
import LogoutButton from "./LogoutButton";
import Aurora from "../components/Aurora";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email as string },
        include: { subscription: true }
    });

    const isActive = user?.subscription?.status === "ACTIVE";

    return (
        <div className="min-h-screen font-sans bg-black relative overflow-hidden">

            {/* --- FONDO AURORA ANIMADO --- */}
            <div className="absolute inset-0 z-0">
                <Aurora
                    colorStops={["#000000", "#B8860B", "#FFD700"]}
                    blend={0.6}
                    amplitude={0.8}
                    speed={0.2}
                />
            </div>

            {/* Header Ultra Transparente */}
            <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/5 px-6 h-24 flex justify-between items-center transition-all">
                <div className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="AlphaGold"
                        className="h-14 w-auto object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.5)] hover:scale-105 transition"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-gray-300 text-sm hidden sm:block tracking-wide font-medium drop-shadow-md">{user?.email}</span>
                    <LogoutButton />
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto p-6 pt-32 space-y-8 relative z-10">

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Status Card */}
                    <div className="p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] group-hover:bg-yellow-500/20 transition duration-700"></div>

                        <h2 className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-4">Membership Status</h2>
                        <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${isActive ? "bg-green-500 shadow-[0_0_15px_#22c55e]" : "bg-red-500 shadow-[0_0_15px_#ef4444]"}`}></div>
                            <span className={`text-3xl font-bold tracking-tight ${isActive ? "text-white" : "text-gray-300"}`}>
                                {isActive ? "ACTIVE MEMBER" : "INACTIVE"}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                            {isActive
                                ? "You have full access to the AlphaGold Signals channel. Enjoy the profits."
                                : "Your access is currently restricted. Activate your plan to join the elite circle."}
                        </p>
                    </div>

                    {/* Action Card */}
                    <div className="p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-center items-start relative">
                        {isActive ? (
                            <a
                                href="https://t.me/AlphaGold_VIP_Bot" // <--- CORREGIDO AQUÍ
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] transition transform hover:scale-[1.02] flex items-center justify-center gap-3 decoration-0"
                            >
                                <span>🤖</span> Claim Telegram Access
                            </a>
                        ) : (
                            <div className="w-full z-10">
                                <BuyButton />
                                <p className="text-[10px] text-gray-500 mt-4 text-center uppercase tracking-widest w-full">
                                    SECURE ENCRYPTED PAYMENT via STRIPE
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Telegram Config Card */}
                <div className="p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/5 uppercase tracking-wider">Telegram Link</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Telegram User / ID</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500"
                                    defaultValue={user?.telegramId || "Not Linked Yet"}
                                    disabled={true}
                                />
                            </div>
                            <div className="flex items-end">
                                <button disabled className="bg-white/5 text-gray-500 px-6 py-3 rounded-lg border border-white/10 cursor-not-allowed text-xs font-bold uppercase tracking-wider">
                                    Linked via Bot
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            {/* CORREGIDO AQUÍ ABAJO */}
                            * To link your account, go to <strong>@AlphaGold_VIP_Bot</strong> on Telegram and type: <code className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">/login {user?.email}</code>
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
}