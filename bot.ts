// bot.ts
import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;

if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");
if (!channelId) throw new Error("Missing TELEGRAM_CHANNEL_ID");

const bot = new TelegramBot(token, { polling: true });
const prisma = new PrismaClient();

console.log("🤖 AlphaGold Bot is running in English...");

// Start Command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "🔒 **AlphaGold VIP Access**\n\nPlease type `/login your@email.com` to verify your payment and receive your unique entry link.",
        { parse_mode: "Markdown" }
    );
});

// Login Command
bot.onText(/\/login (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const email = match ? match[1].trim() : null;

    if (!email) return bot.sendMessage(chatId, "❌ Missing email. Usage: /login name@example.com");

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: { subscription: true }
        });

        if (!user) {
            return bot.sendMessage(chatId, "⚠️ Email not found. Please register on the website first.");
        }

        // Update Telegram ID
        await prisma.user.update({
            where: { email: email },
            data: { telegramId: chatId.toString() }
        });

        if (user.subscription?.status === "ACTIVE") {
            bot.sendMessage(chatId, "✅ **Payment Verified.** Generating your unique link...");

            try {
                // Generate One-Time Link
                const inviteLink = await bot.createChatInviteLink(channelId, {
                    member_limit: 1,
                    expire_date: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
                    name: `Access for ${user.name}`
                });

                bot.sendMessage(
                    chatId,
                    `🎟 **Here is your VIP Ticket:**\n\n${inviteLink.invite_link}\n\n⚠️ This link is valid for ONE use only. Do not share it.`,
                );

            } catch (err) {
                console.error("Link generation error:", err);
                bot.sendMessage(chatId, "⚠️ Technical Error: Ensure the bot is an ADMIN in the channel.");
            }

        } else {
            bot.sendMessage(chatId, `🛑 **Inactive Subscription**\nGo to the dashboard to activate your membership.`);
        }

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "Internal System Error.");
    }
});

bot.on("polling_error", (err) => console.log(err));