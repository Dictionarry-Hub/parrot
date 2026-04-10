import { SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../types";

const ALLOWED_USERS = ["419831327974490112"];

// https://discord.com/channels/guild/channel/message
const LINK_REGEX = /channels\/\d+\/(\d+)\/(\d+)$/;

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("respond")
    .setDescription("Reply to a message as the bot")
    .addStringOption((opt) =>
      opt.setName("link").setDescription("Message link").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("text").setDescription("Response text").setRequired(true)
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    if (!ALLOWED_USERS.includes(interaction.user.id)) {
      await interaction.reply({ content: "No.", ephemeral: true });
      return;
    }

    const link = interaction.options.getString("link", true);
    const text = interaction.options.getString("text", true);

    const match = link.match(LINK_REGEX);
    if (!match) {
      await interaction.reply({
        content: "Invalid message link.",
        ephemeral: true,
      });
      return;
    }

    const [, channelId, messageId] = match;

    const channel = await interaction.client.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannel)) {
      await interaction.reply({
        content: "Channel not found or not a text channel.",
        ephemeral: true,
      });
      return;
    }

    const message = await channel.messages.fetch(messageId);
    if (!message) {
      await interaction.reply({
        content: "Message not found.",
        ephemeral: true,
      });
      return;
    }

    await message.reply({
      content: text,
      allowedMentions: { repliedUser: false },
    });

    await interaction.reply({ content: "Done.", ephemeral: true });
  },
};
