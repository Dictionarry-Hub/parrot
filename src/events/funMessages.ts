import { Message } from "discord.js";
import { Event } from "../types";

const TRIGGERS: { pattern: RegExp; responses: string[] }[] = [
  { pattern: /delavicci sucks/, responses: ["I concur.", "Hard agree.", "Based.", "Factual."] },
  { pattern: /good bot/, responses: ["I know.", "Thanks, I try.", "Better than Santiago at least."] },
  { pattern: /bad bot/, responses: ["Blame Santiago.", "I learned it from watching you.", "No u."] },
  { pattern: /parrot/, responses: ["🦜", "Squawk?", "That's my name, don't wear it out."] },
  { pattern: /(?=.*toggle)(?=.*ux)/, responses: ["Nobody cares about your toggle UX opinions.", "The toggle is fine. You are not.", "Sir this is a media server bot."] },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const event: Event<"messageCreate"> = {
  name: "messageCreate",
  once: false,
  execute: async (client, ...args: unknown[]) => {
    const message = args[0] as Message;

    if (message.author.bot) return;
    if (!message.guild) return;

    const content = message.content.toLowerCase();

    for (const { pattern, responses } of TRIGGERS) {
      if (pattern.test(content)) {
        await message.reply({
          content: getRandomItem(responses),
          allowedMentions: { repliedUser: false },
        });
        return;
      }
    }
  },
};
