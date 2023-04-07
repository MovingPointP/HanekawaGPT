import { returnMessage } from "./returnMessage.ts";
import { createBot, Intents, startBot } from "./deps.ts";
import { Secret } from "./secret.ts";
import { Messages } from "./messages.ts";

let messagesToSend: Messages;
const bot = createBot({
  token: Secret.DISCORD_TOKEN,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready: (_b, payload) => {
      console.log(`${payload.user.username} is ready!`);
      messagesToSend = new Messages();
    },
  },
});

bot.events.messageCreate = (bot, message) => {
  if (message.channelId !== BigInt(Secret.CHANNEL_ID)) return;
  if (message.isFromBot) return;
  returnMessage(bot, message.content, messagesToSend);
};

await startBot(bot);
