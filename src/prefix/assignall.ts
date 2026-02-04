import { Message } from "discord.js";
import { registerPrefixCommand } from "./registry";

const ALLOWED_USERS = ["santiagosayshey"];

registerPrefixCommand({
  name: "assignall",
  description: "Bulk assign Member role to all server members (Santiago only, one-time use)",
  execute: async (message: Message) => {
    if (!ALLOWED_USERS.includes(message.author.username.toLowerCase())) {
      return;
    }

    const isDev = process.env.NODE_ENV === "development";
    const roleId = isDev ? process.env.MEMBER_ROLE_DEV : process.env.MEMBER_ROLE;

    if (!roleId) {
      await message.reply("MEMBER_ROLE not configured in .env");
      return;
    }

    const guild = message.guild;
    if (!guild) return;

    const role = guild.roles.cache.get(roleId);
    if (!role) {
      await message.reply(`Role ${roleId} not found.`);
      return;
    }

    await message.reply(`Fetching all members...`);

    const members = await guild.members.fetch();
    const needsRole = members.filter(
      (m) => !m.user.bot && !m.roles.cache.has(roleId)
    );

    await message.channel.send(
      `Found ${needsRole.size} members without the ${role.name} role. Assigning now...`
    );

    let assigned = 0;
    let failed = 0;

    for (const [, member] of needsRole) {
      try {
        await member.roles.add(role);
        assigned++;
        if (assigned % 50 === 0) {
          await message.channel.send(
            `Progress: ${assigned}/${needsRole.size}`
          );
        }
      } catch (err) {
        failed++;
      }
      // 1 second delay to stay within rate limits
      await new Promise((r) => setTimeout(r, 1000));
    }

    await message.channel.send(
      `Done. Assigned ${role.name} to ${assigned} members. ${failed > 0 ? `Failed: ${failed}.` : ""}`
    );
  },
});