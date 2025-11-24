// app/api/webhook/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import TelegramBot from 'node-telegram-bot-api'; // Importamos el bot aquí también

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
});

// Instanciamos el bot solo para enviar comandos (sin polling)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });
const channelId = process.env.TELEGRAM_CHANNEL_ID!;

export async function POST(req: Request) {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        return new NextResponse("Webhook Error", { status: 400 });
    }

    // CASO 1: PAGO EXITOSO (ACTIVAR)
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.metadata?.userId || session.customer_email;

        if (email) {
            await prisma.subscription.upsert({
                where: { userId: email },
                update: {
                    status: "ACTIVE",
                    stripeCustomerId: session.customer as string,
                },
                create: {
                    userId: (await prisma.user.findUnique({ where: { email } }))?.id as string,
                    status: "ACTIVE",
                    stripeCustomerId: session.customer as string,
                }
            });
            console.log(`✅ Usuario activado: ${email}`);
        }
    }

    // CASO 2: SUSCRIPCIÓN CANCELADA O ELIMINADA (EXPULSAR)
    // Esto ocurre si el usuario cancela o si Stripe se rinde tras varios intentos de cobro fallidos
    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        console.log(`💀 Suscripción eliminada para cliente: ${stripeCustomerId}`);

        // 1. Buscar al usuario en nuestra DB usando el ID de cliente de Stripe
        const dbSub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: stripeCustomerId },
            include: { user: true }
        });

        if (dbSub && dbSub.user.telegramId) {
            try {
                // 2. EXPULSAR DE TELEGRAM
                // unbanChatMember con kick=true es la forma de expulsar y permitir que vuelvan si pagan.
                // banChatMember bloquea permanentemente. Usaremos banChatMember para asegurar que salgan.
                // revoke_messages: false para no borrar sus mensajes viejos.
                await bot.banChatMember(channelId, parseInt(dbSub.user.telegramId));

                // Opcional: Desbanear inmediatamente después para que puedan volver a unirse si pagan en el futuro.
                // Si no haces esto, quedan en la lista negra para siempre.
                await bot.unbanChatMember(channelId, parseInt(dbSub.user.telegramId));

                console.log(`🚫 Usuario ${dbSub.user.email} expulsado de Telegram.`);

                // 3. Avisarle al usuario por privado (Opcional, pero amable)
                await bot.sendMessage(dbSub.user.telegramId, "⚠️ **Tu membresía ha expirado.**\nHemos tenido que revocar tu acceso al canal VIP.\n\nPuedes reactivarla en cualquier momento desde el Dashboard.");

            } catch (error) {
                console.error("Error al intentar expulsar en Telegram:", error);
            }
        }

        // 4. Actualizar DB a INACTIVE
        if (dbSub) {
            await prisma.subscription.update({
                where: { id: dbSub.id },
                data: { status: "INACTIVE" }
            });
        }
    }

    return new NextResponse(null, { status: 200 });
}