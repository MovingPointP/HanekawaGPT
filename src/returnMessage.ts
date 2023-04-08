import { Bot } from "./deps.ts";
import { Secret } from "./secret.ts";
import { GPTMessage, GPTMessages } from "./GPTMessage.ts";
import { isCorrectNumber } from "./number.ts";

export const returnMessage = async (
  bot: Bot,
  content: string,
  messagesToSend: GPTMessages,
) => {
  const messages = makeRequestMessage(content, messagesToSend);
  const options = makeRequestOption(messages);

  let result: string;
  try {
    const response = await (await fetch(Secret.GPT_ENDPOINT, options)).json();
    console.log(messages);
    console.log(response);
    result = response.choices[0].message.content;
    messagesToSend.set(messages.slice(-1)[0]);
    messagesToSend.set({ role: "assistant", content: result });
  } catch (error) {
    result = String(error);
  } finally {
    await bot.helpers.sendMessage(Secret.CHANNEL_ID, {
      content: result!,
    });
  }
};

const makeRequestMessage = (content: string, messagesToSend: GPTMessages) => {
  let countToLookBack = 0;
  let pastMessages: GPTMessage[] = [];
  let nowMessage: GPTMessage;
  const contents = content.split(" ");

  if (isCorrectNumber(contents[0])) {
    countToLookBack = Number(contents[0]);
    pastMessages = messagesToSend.get(countToLookBack * 2);
    nowMessage = { role: "user", content: contents.slice(1).join("") };
  } else {
    nowMessage = { role: "user", content: content };
  }

  return [...pastMessages, nowMessage];
};

const makeRequestOption = (messages: GPTMessage[]) => {
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

  return options;
};
