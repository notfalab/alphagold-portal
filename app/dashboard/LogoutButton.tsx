// app/dashboard/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })} // Redirige al login al terminar
            className="text-xs uppercase font-bold tracking-wider text-red-400 hover:text-red-300 transition drop-shadow-sm"
        >
            Logout
        </button>
    );
}