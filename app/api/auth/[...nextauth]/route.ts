// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// ESTA ES LA PARTE CLAVE:
// Next.js App Router exige exportar GET y POST así:
export { handler as GET, handler as POST };