import { Message } from "discord.js";
import { registerPrefixCommand } from "./registry";

const WELCOME_REMARKS = [
  "Welcome! Bold move wandering in here.",
  "Welcome, fresh meat for the custom format grinder.",
  "Welcome! The exit is... somewhere.",
  "Welcome! Let's see how long this one lasts.",
  "Welcome! Please direct all complaints to Santiago.",
  "Welcome to the cult of quality profiles.",
  "Welcome! We have regex and existential dread.",
  "Welcome! There's no going back now.",
  "Welcome! Abandon all hope of a simple setup.",
  "Welcome! Your free trial of sanity has begun.",
  "Welcome! Don't mention YIFY around Seraphys. Trust me.",
  "Welcome! Seraphys is already judging your library.",
  "Welcome! If your encodes are bad, Seraphys will know. He always knows.",
  "Welcome! Santiago wrote 400 lines of code for something that needed 12. You'll fit right in.",
  "Welcome! Don't let Santiago help you. You'll end up with 47 custom formats.",
  "Welcome! Fair warning: ask a simple question, get a Santiago-length answer.",
];

function getRandomRemark(): string {
  return WELCOME_REMARKS[Math.floor(Math.random() * WELCOME_REMARKS.length)];
}

registerPrefixCommand({
  name: "welcome",
  description: "Send a welcome message (Santiago only)",
  execute: async (message: Message) => {
    if (message.author.username.toLowerCase() !== "santiagosayshey") {
      return;
    }

    await message.reply(getRandomRemark());
  },
});
