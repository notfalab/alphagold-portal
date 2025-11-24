// cron-kick.ts
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });
const channelId = process.env.TELEGRAM_CHANNEL_ID!;

async function runReaper() {
    console.log("💀 Iniciando protocolo de expulsión masiva...");

    // Buscar usuarios que están INACTIVE pero tienen un Telegram ID registrado
    // (Asumimos que si tienen ID, podrían seguir dentro del canal)
    const expiredUsers = await prisma.user.findMany({
        where: {
            telegramId: { not: null }, // Tienen telegram vinculado
            subscription: {
                status: { not: "ACTIVE" } // Y NO están activos
            }
        },
        include: { subscription: true }
    });

    console.log(`🔍 Se encontraron ${expiredUsers.length} usuarios para revisar.`);

    for (const user of expiredUsers) {
        if (!user.telegramId) continue;

        console.log(`🚫 Expulsando a: ${user.email} (ID: ${user.telegramId})`);

        try {
            // Intentar expulsar
            await bot.banChatMember(channelId, parseInt(user.telegramId));
            await bot.unbanChatMember(channelId, parseInt(user.telegramId)); // Desbanear para permitir reingreso futuro

            // Enviar aviso
            await bot.sendMessage(user.telegramId, "⚠️ Tu periodo de suscripción ha finalizado y has sido removido del canal.");

            // Opcional: Borrar telegramId de la DB para no intentar expulsarlo de nuevo mañana
            // await prisma.user.update({
            //   where: { id: user.id },
            //   data: { telegramId: null } // Descomenta esto si quieres "desvincularlos"
            // });

        } catch (error: any) {
            // Si el error es "User not found", es que ya se salió él mismo.
            if (error?.response?.body?.description?.includes("participant")) {
                console.log(`- El usuario ${user.email} ya no estaba en el canal.`);
            } else {
                console.error(`Error expulsando a ${user.email}:`, error.message);
            }
        }
    }

    console.log("🏁 Barrido completado.");
    process.exit(0);
}

runReaper();