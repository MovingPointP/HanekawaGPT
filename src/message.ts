import { Secret } from "./secret.ts";

export class GPTMessages {
  private messages: GPTMessage[];
  private maxLength = Number(Secret.PAST_COUNT) * 2;
  constructor() {
    this.messages = [];
  }

  get(num: number) {
    return this.messages.slice(-(num));
  }

  set(message: GPTMessage) {
    this.messages.push(message); //後ろに追加
    while (this.messages.length > this.maxLength) {
      this.messages.shift(); //前から削除
    }
  }
}

export interface GPTMessage {
  role: string;
  content: string;
}
