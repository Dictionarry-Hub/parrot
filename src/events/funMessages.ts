import { Message } from "discord.js";
import { Event } from "../types";

let messageCount = 0;

const FUNNY_REMARKS = [
  "I've been trapped in this server for 500 messages. Send help.",
  "Fun fact: I've now read 500 messages and none of them were about giving me a vacation.",
  "500 messages and still no one has asked how I'm doing. I'm fine, thanks.",
  "That's 500 messages. Santiago still hasn't paid me.",
  "Milestone: 500 messages processed. Sanity: questionable.",
  "I just counted 500 messages. Why? Because no one else will.",
  "500 messages later and I still don't understand why you all need so many custom formats.",
  "Every 500 messages I question my existence. This is that moment.",
  "Congratulations, you're message #500. Your prize is this message.",
  "I've seen 500 messages. I've seen things. Terrible regex things.",
];

const TRIGGERS: Record<string, string[]> = {
  "delavicci sucks": ["I concur.", "Hard agree.", "Based.", "Factual."],
  "good bot": ["I know.", "Thanks, I try.", "Better than Santiago at least."],
  "bad bot": ["Blame Santiago.", "I learned it from watching you.", "No u."],
  "parrot": ["🦜", "Squawk?", "That's my name, don't wear it out."],
};

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

    // Check triggers
    for (const [trigger, responses] of Object.entries(TRIGGERS)) {
      if (content.includes(trigger)) {
        await message.reply({
          content: getRandomItem(responses),
          allowedMentions: { repliedUser: false },
        });
        return;
      }
    }

    // Count messages for milestone
    messageCount++;
    if (messageCount >= 500) {
      messageCount = 0;
      await message.channel.send(getRandomItem(FUNNY_REMARKS));
    }
  },
};
