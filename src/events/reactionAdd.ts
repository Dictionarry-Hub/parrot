import { MessageReaction, User, PartialMessageReaction, PartialUser } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";
import { staffLog } from "@staffLog";

function getEmojiRoleMap(): Record<string, string | undefined> {
  const isDev = process.env.NODE_ENV === "development";
  return {
    "✅": isDev ? process.env.MEMBER_ROLE_DEV : process.env.MEMBER_ROLE,
    "🎉": isDev ? process.env.ANNOUNCEMENTS_ROLE_DEV : process.env.ANNOUNCEMENTS_ROLE,
    "🏷️": isDev ? process.env.CHANGELOG_ROLE_DEV : process.env.CHANGELOG_ROLE,
    "🧪": isDev ? process.env.DEV_UPDATES_ROLE_DEV : process.env.DEV_UPDATES_ROLE,
  };
}

function getTargetMessageIds(): { rules: string | undefined; notifications: string | undefined } {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    const devId = process.env.REACTION_MESSAGE_DEV;
    return { rules: devId, notifications: devId };
  }
  return {
    rules: process.env.RULES_MESSAGE_ID,
    notifications: process.env.NOTIFICATIONS_MESSAGE_ID,
  };
}

export const event: Event<"messageReactionAdd"> = {
  name: "messageReactionAdd",
  once: false,
  execute: async (client, ...args: unknown[]) => {
    const reaction = args[0] as MessageReaction | PartialMessageReaction;
    const user = args[1] as User | PartialUser;

    if (user.bot) return;

    // Fetch partials if needed
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        logger.error("Failed to fetch reaction", { error });
        return;
      }
    }

    const messageId = reaction.message.id;
    const emoji = reaction.emoji.name;
    if (!emoji) return;

    const { rules, notifications } = getTargetMessageIds();
    const isRulesMessage = messageId === rules;
    const isNotificationsMessage = messageId === notifications;

    if (!isRulesMessage && !isNotificationsMessage) return;

    // Check if emoji is valid for any applicable message type
    const isValidRulesEmoji = isRulesMessage && emoji === "✅";
    const isValidNotificationEmoji = isNotificationsMessage && ["🎉", "🏷️", "🧪"].includes(emoji);

    if (!isValidRulesEmoji && !isValidNotificationEmoji) return;

    const roleId = getEmojiRoleMap()[emoji];

    if (!roleId) {
      logger.warn(`No role configured for emoji: ${emoji}`);
      return;
    }

    try {
      const guild = reaction.message.guild;
      if (!guild) return;

      const member = await guild.members.fetch(user.id);
      const role = await guild.roles.fetch(roleId);
      await member.roles.add(roleId);

      logger.info(`Added role to ${user.tag}`, { emoji, roleId });

      staffLog(client, {
        title: "Role Added",
        fields: [
          { name: "User", value: user.tag ?? user.id, inline: true },
          { name: "Role", value: role?.name ?? roleId, inline: true },
          { name: "Via", value: emoji, inline: true },
        ],
        type: "success",
      });
    } catch (error) {
      logger.error("Failed to add role", { error, userId: user.id, emoji });
    }
  },
};
