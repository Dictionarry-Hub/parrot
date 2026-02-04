import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { registerPrefixCommand } from "./registry";
import { getChannel } from "@channel";

const ALLOWED_USERS = ["santiagosayshey", "seraphys"];
const EMBED_COLOR = 0x57f287;

registerPrefixCommand({
  name: "readme",
  description: "Post all readme messages (Santiago/Seraphys only)",
  execute: async (message: Message) => {
    if (!ALLOWED_USERS.includes(message.author.username.toLowerCase())) {
      return;
    }

    await message.delete().catch(() => {});

    const isDev = process.env.NODE_ENV === "development";
    const readmeChannel = getChannel(message.client, isDev ? process.env.DEV : process.env.README);

    if (!readmeChannel) {
      if (message.channel instanceof TextChannel) {
        await message.channel.send("README channel not configured.");
      }
      return;
    }

    const bot = message.client.user;

    // Message 1: Welcome
    const welcome = new EmbedBuilder()
      .setAuthor({ name: bot?.username ?? "Parrot", iconURL: bot?.displayAvatarURL() })
      .setTitle("Welcome to Dictionarry")
      .setDescription(
        "If you've ever spent an evening trying to figure out why Radarr grabbed a terrible encode instead of the remux sitting right there, or why your custom formats don't seem to be doing anything, this is the place.\n\n" +
        "We maintain a database of configurations for Radarr and Sonarr (quality profiles, custom formats, scoring) and a tool called Profilarr that handles syncing all of it to your setup so you're not recreating things by hand every time something changes.\n\n" +
        "• 🌐 [Website](https://dictionarry.dev/)\n" +
        "• 🎯 [Profile Selector](https://dictionarry.dev/quality-profile)\n" +
        "• <:database:1464294490708906297> [Database](https://github.com/Dictionarry-Hub/database)\n" +
        "• <:profilarr:1464294188773412957> [Profilarr](https://github.com/Dictionarry-Hub/profilarr)\n" +
        "• 💬 [Discord](https://discord.gg/zU4Wnxf5QJ)\n" +
        "• ❤️ [Donate](https://github.com/sponsors/Dictionarry-Hub)"
      )
      .setColor(EMBED_COLOR);

    // Message 3: Rules & Getting Help
    const rules = new EmbedBuilder()
      .setAuthor({ name: bot?.username ?? "Parrot", iconURL: bot?.displayAvatarURL() })
      .setTitle("Rules")
      .setDescription(
        "1. **No indexer or tracker discussion.** We respect the privacy and rules of private trackers. No invite talk, no \"which tracker should I join,\" no tracker recommendations. No support for Real-Debrid users.\n" +
        "2. **No piracy links.** Don't share or request links to copyrighted content.\n" +
        "3. **No spam or self-promotion.** No server invites, ads, or unsolicited DMs without staff permission.\n" +
        "4. **Keep it civil.** Argue ideas, not people. No harassment, bigotry, or hate speech.\n" +
        "5. **No NSFW content.**\n\n" +
        "If something comes up, the first time you'll hear about it privately. The second time, more loudly. The third time, you're out. Harassment, bigotry, or doxxing skip the strikes and get you removed immediately.\n\n" +
        "[Full Code of Conduct](https://github.com/Dictionarry-Hub/profilarr?tab=coc-ov-file#code-of-conduct)\n\n" +
        "**Getting Help**\n" +
        "• Got a question? Open a thread in `questions`.\n" +
        "• Found a bug or want a feature? Use `/support`.\n" +
        "• Need a quick answer? Type `!help` for a list of bot commands.\n\n" +
        "React with ✅ to confirm you've read the above and get access to the rest of the server."
      )
      .setColor(EMBED_COLOR);

    // Message 5: Notification Roles
    const notifications = new EmbedBuilder()
      .setAuthor({ name: bot?.username ?? "Parrot", iconURL: bot?.displayAvatarURL() })
      .setTitle("Notification Roles")
      .setDescription(
        "React to opt in, unreact to opt out.\n\n" +
        "• 🎉 Announcements\n" +
        "• 🏷️ Changelog\n" +
        "• 🧪 Dev Updates"
      )
      .setColor(EMBED_COLOR);

    await readmeChannel.send({ embeds: [welcome] });
    await readmeChannel.send({ embeds: [rules] });
    await readmeChannel.send({ embeds: [notifications] });
  },
});
