import { Bot, Message, stopBot } from "./deps.ts";
import { Secret } from "./secret.ts";

export const stopBotActivity = (bot: Bot) => {
  stopBot(bot);
  throw ("stop bot");
};

export const checkMessageToStop = (message: Message) => {
  if (!message.member?.roles.includes(BigInt(Secret.ROLE_ID))) return false;
  if (message.content === "停止") {
    return true;
  } else {
    return false;
  }
};
