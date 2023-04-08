import { dotenv } from "./deps.ts";

try {
  dotenv.configSync({
    export: true,
    path: "./.env",
  });
} catch (e: unknown) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}

export const Secret = {
  DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN") || "",
  CHANNEL_ID: Deno.env.get("CHANNEL_ID") || "",
  ROLE_ID: Deno.env.get("CHANNEL_ID") || "",

  API_TOKEN: Deno.env.get("API_TOKEN") || "",
  GPT_ENDPOINT: Deno.env.get("GPT_ENDPOINT") || "",
  MODEL_NAME: Deno.env.get("MODEL_NAME") || "",
  MODEL_TEMP: Number(Deno.env.get("MODEL_TEMP")) || 0.5,
  MAX_TOKENS: Number(Deno.env.get("MAX_TOKENS")) || 256,
  PAST_COUNT: Deno.env.get("PAST_COUNT") || "3",
};
