import { Secret } from "./secret.ts";

export const isCorrectNumber = (text: string) => {
  const reg = new RegExp("[1-" + Secret.PAST_COUNT + "]");
  return text.match(reg);
};
