import { GuildMember } from "discord.js";
import { Event } from "../types";
import { getChannel } from "@channel";
import { staffLog } from "@staffLog";

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
  // Seraphys
  "Welcome! Don't mention YIFY around Seraphys. Trust me.",
  "Welcome! Seraphys is already judging your library.",
  "Welcome! If your encodes are bad, Seraphys will know. He always knows.",
  // Santiago
  "Welcome! Santiago wrote 400 lines of code for something that needed 12. You'll fit right in.",
  "Welcome! Don't let Santiago help you. You'll end up with 47 custom formats.",
  "Welcome! Fair warning: ask a simple question, get a Santiago-length answer.",
];

function getRandomRemark(): string {
  return WELCOME_REMARKS[Math.floor(Math.random() * WELCOME_REMARKS.length)];
}

export const event: Event<"guildMemberAdd"> = {
  name: "guildMemberAdd",
  once: false,
  execute: async (client, ...args: unknown[]) => {
    const member = args[0] as GuildMember;

    // Log to staff
    staffLog(client, {
      title: "Member Joined",
      fields: [
        { name: "User", value: member.user.tag, inline: true },
        { name: "Account Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      ],
      type: "info",
    });

    // Welcome in greetz channel
    const isDev = process.env.NODE_ENV === "development";
    const welcomeChannel = getChannel(client, isDev ? process.env.DEV : process.env.WELCOME);

    if (welcomeChannel) {
      await welcomeChannel.send(`<@${member.id}> ${getRandomRemark()}`);
    }
  },
};
