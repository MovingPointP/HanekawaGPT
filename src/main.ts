import { returnMessage } from "./returnMessage.ts";
import { createBot, Intents, startBot } from "./deps.ts";
import { Secret } from "./secret.ts";
import { GPTMessages } from "./GPTMessage.ts";
import { checkMessageToStop, stopBotActivity } from "./stopBot.ts";

let messagesToSend: GPTMessages;
const bot = createBot({
  token: Secret.DISCORD_TOKEN,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready: (_b, payload) => {
      console.log(`${payload.user.username} is ready!`);
      messagesToSend = new GPTMessages();
    },
  },
});

bot.events.messageCreate = (bot, message) => {
  if (message.channelId !== BigInt(Secret.CHANNEL_ID)) return;
  if (message.isFromBot) return;
  console.log(message);
  if (checkMessageToStop(message)) {
    stopBotActivity(bot);
  }
  returnMessage(bot, message.content, messagesToSend);
};

await startBot(bot);
