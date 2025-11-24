// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "AlphaGold VIP Membership",
                            description: "Monthly access to exclusive trading signals",
                        },
                        // CAMBIO AQUÍ: $97.00 (en centavos)
                        unit_amount: 9700,
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=1`,
            customer_email: session.user.email,
            metadata: {
                userId: session.user.email,
            },
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}