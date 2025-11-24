// app/page.tsx
import Link from "next/link";
import Aurora from "./components/Aurora";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative">

      <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden z-0">
        <Aurora
          colorStops={["#000000", "#B8860B", "#FFD700"]}
          blend={0.7}
          amplitude={1.2}
          speed={0.5}
        />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Header Ultra Transparente (Glass) */}
      {/* Cambiado a bg-black/20 para máxima visibilidad de la aurora */}
      <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">

          {/* SOLO LOGO */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="AlphaGold Logo"
              className="h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.6)] hover:scale-105 transition"
            />
          </div>

          <div className="space-x-6">
            <Link
              href="/login"
              className="text-gray-200 hover:text-white transition text-sm uppercase tracking-wider font-bold shadow-black drop-shadow-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition transform hover:scale-105"
            >
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 relative z-10">
        <div className="max-w-4xl space-y-8 p-10 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-2xl">

          <span className="inline-block py-1 px-4 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/20 tracking-widest uppercase mb-4 animate-pulse">
            🚀 Premium Trading Signals
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
            Master the Market with <br />
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Institutional Precision
            </span>
          </h1>

          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium">
            Gain access to our exclusive Telegram channel. Real-time analysis, high-precision entries, and professional risk management.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link
              href="/register"
              className="px-10 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.5)] transition transform hover:-translate-y-1"
            >
              Start Membership
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-lg font-bold rounded-xl border border-white/20 backdrop-blur-md transition hover:border-yellow-500/50"
            >
              Member Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5 relative z-10 bg-black">
        © 2025 AlphaGold Trading. All rights reserved.
      </footer>
    </div>
  );
}