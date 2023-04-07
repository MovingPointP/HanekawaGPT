import { Bot } from "./deps.ts";
import { Secret } from "./secret.ts";
import { Message, Messages } from "./messages.ts";
import { isCorrectNumber } from "./check.ts";

export const returnMessage = async (
  bot: Bot,
  content: string,
  messagesToSend: Messages,
) => {
  let countToLookBack = 0;
  let pastMessages: Message[] = [];
  let nowMessage: Message;
  const contents = content.split(" ");

  if (isCorrectNumber(contents[0])) {
    countToLookBack = Number(contents[0]);
    pastMessages = messagesToSend.get(countToLookBack * 2);
    nowMessage = { role: "user", content: contents.slice(1).join("") };
  } else {
    nowMessage = { role: "user", content: content };
  }

  const messages = [...pastMessages, nowMessage];

  // リクエストヘッダ
  const headers = {
    "Authorization": "Bearer " + Secret.API_TOKEN,
    "Content-type": "application/json",
  };
  // リクエストオプション
  const options = {
    "method": "POST",
    "headers": headers,
    "body": JSON.stringify({
      "model": Secret.MODEL_NAME,
      "max_tokens": Secret.MAX_TOKENS,
      "temperature": Secret.MODEL_TEMP,
      "messages": messages,
    }),
  };

  let result: string;
  try {
    const response = await (await fetch(Secret.GPT_ENDPOINT, options)).json();
    console.log(messages);
    console.log(response);
    result = response.choices[0].message.content;
    messagesToSend.set(nowMessage);
    messagesToSend.set({ role: "assistant", content: result });
  } catch (error) {
    result = String(error);
  } finally {
    await bot.helpers.sendMessage(Secret.CHANNEL_ID, {
      content: result!,
    });
  }
};
