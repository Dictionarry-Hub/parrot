import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { Event } from "../types";
import { staffLog } from "@staffLog";
import { addStrike, resetStrikes } from "@carrier/db";

const IMMUNE_USERS = ["santiagosayshey", "seraphys"];

// Private trackers
const TRACKERS = [
  "passthepopcorn", "ptp",
  "anthelion",
  "secret cinema",
  "cinemageddon", "cg",
  "karagarga", "kg",
  "broadcasthenet", "btn",
  "tv vault", "tvv",
  "morethantv", "mtv",
  "nebulance",
  "beyondhd", "bhd",
  "hdbits",
  "blutopia", "blu",
  "hawke-uno",
  "aither",
  "uhdbits",
  "reelflix",
  "greatposterwall", "gpw",
  "fearnopeer", "fnp",
  "redacted", "red",
  "orpheus", "ops",
  "concertos",
  "gazellegames", "ggn",
  "sportscult",
  "myanonamouse", "mam",
  "animebytes", "ab",
  "bakabt",
  "empornium",
  "filelist", "fl",
  "iptorrents", "ipt",
  "torrentleech", "tl",
  "torrentday",
  "alpharatio",
  "torrentseeds",
  "avistaz",
  "cinemaz",
  "privatehd",
  "trackerhub",
  "r/trackers",
  "r/opensignups",
];

// Invite-related keywords
const INVITE_KEYWORDS = [
  "invite",
  "invites",
  "recruitment",
  "open signup",
  "open signups",
  "ratio proof",
  "user class",
  "power user",
];

// Usenet providers/indexers
const USENET = [
  "usenet",
  "newsgroup",
  "nzb",
  "nzbgeek",
  "nzbplanet",
  "drunkenslug",
  "nzbfinder",
  "nzbsu",
  "althub",
  "newsdemon",
  "newshosting",
  "easynews",
  "eweka",
  "supernews",
  "astraweb",
  "frugalusenet",
  "usenetserver",
  "ninja",
  "sabnzbd",
  "nzbget",
];

// Derogatory terms (keeping it basic)
const DEROGATORY = [
  "nigger",
  "nigga",
  "faggot",
  "fag",
  "retard",
  "retarded",
  "tranny",
  "kike",
  "spic",
  "chink",
  "gook",
  "wetback",
  "beaner",
  "dyke",
];

type ViolationType = "tracker_invite" | "usenet_invite" | "derogatory";

function checkViolation(content: string): { type: ViolationType; matched: string } | null {
  const lower = content.toLowerCase();

  // Check derogatory first (most serious)
  for (const term of DEROGATORY) {
    if (lower.includes(term)) {
      return { type: "derogatory", matched: term };
    }
  }

  // Check for invite keywords first
  const hasInviteKeyword = INVITE_KEYWORDS.some((kw) => lower.includes(kw));
  if (!hasInviteKeyword) return null;

  // Tracker + invite = violation
  for (const tracker of TRACKERS) {
    if (lower.includes(tracker)) {
      return { type: "tracker_invite", matched: tracker };
    }
  }

  // Usenet + invite = violation
  for (const term of USENET) {
    if (lower.includes(term)) {
      return { type: "usenet_invite", matched: term };
    }
  }

  return null;
}

const VIOLATION_MESSAGES: Record<ViolationType, string> = {
  tracker_invite: "Tracker invite/recruitment discussion is not allowed here.",
  usenet_invite: "Usenet invite/recruitment discussion is not allowed here.",
  derogatory: "Hate speech and slurs are not tolerated.",
};

export const event: Event<"messageCreate"> = {
  name: "messageCreate",
  once: false,
  execute: async (client, ...args: unknown[]) => {
    const message = args[0] as Message;

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.deletable) return;

    const violation = checkViolation(message.content);
    if (!violation) return;

    // Delete the message
    try {
      await message.delete();
    } catch {
      return; // Can't delete, bail
    }

    const warning = VIOLATION_MESSAGES[violation.type];

    // Check if user is immune (dev/admin testing)
    const username = message.author.username.toLowerCase();
    if (IMMUNE_USERS.includes(username)) {
      try {
        const embed = new EmbedBuilder()
          .setTitle("Debug: Moderation Triggered")
          .setDescription("Your message was removed (exempt user - no strike added).")
          .addFields(
            { name: "Type", value: violation.type, inline: true },
            { name: "Matched", value: violation.matched, inline: true },
            { name: "Content", value: message.content.slice(0, 1000) }
          )
          .setColor(0x5865f2)
          .setTimestamp();

        await message.author.send({ embeds: [embed] });
      } catch {
        // DMs closed
      }
      return;
    }

    const strikes = addStrike(message.author.id);

    if (strikes >= 4) {
      // 4th strike = ban
      try {
        await message.member?.ban({ reason: `4 strikes: ${violation.type}` });
      } catch {
        // Can't ban, might not have perms
      }

      staffLog(client, {
        title: "User Banned (4 Strikes)",
        fields: [
          { name: "User", value: message.author.tag, inline: true },
          { name: "Final Violation", value: violation.type, inline: true },
          { name: "Matched", value: violation.matched, inline: true },
          { name: "Content", value: message.content.slice(0, 1000) },
        ],
        type: "error",
      });
    } else if (strikes === 3) {
      // 3rd strike = kick + DM warning about ban
      try {
        const embed = new EmbedBuilder()
          .setTitle("You Have Been Kicked")
          .setDescription(`You were kicked from **${message.guild.name}**.`)
          .addFields(
            { name: "Reason", value: warning },
            { name: "Your Message", value: message.content.slice(0, 1000) }
          )
          .setFooter({ text: "This is your 3rd strike. If you rejoin and violate the rules again, you will be permanently banned." })
          .setColor(0xed4245)
          .setTimestamp();

        await message.author.send({ embeds: [embed] });
      } catch {
        // DMs closed
      }

      try {
        await message.member?.kick(`3rd strike: ${violation.type}`);
      } catch {
        // Can't kick
      }

      staffLog(client, {
        title: "User Kicked (3 Strikes)",
        fields: [
          { name: "User", value: message.author.tag, inline: true },
          { name: "Type", value: violation.type, inline: true },
          { name: "Matched", value: violation.matched, inline: true },
          { name: "Content", value: message.content.slice(0, 1000) },
        ],
        type: "error",
      });
    } else if (strikes === 2) {
      // 2nd strike = public callout
      const embed = new EmbedBuilder()
        .setTitle("Warning")
        .setDescription(
          `<@${message.author.id}>, your message was removed.\n\n**Reason:** ${warning}\n\nThis is your **2nd strike**. Further violations will result in a kick or ban.`
        )
        .setColor(0xfee75c)
        .setTimestamp();

      if (message.channel instanceof TextChannel) {
        try {
          await message.channel.send({ embeds: [embed] });
        } catch {
          // Channel might not allow messages
        }
      }

      staffLog(client, {
        title: "Strike 2 - Public Warning",
        fields: [
          { name: "User", value: message.author.tag, inline: true },
          { name: "Type", value: violation.type, inline: true },
          { name: "Matched", value: violation.matched, inline: true },
          { name: "Content", value: message.content.slice(0, 1000) },
        ],
        type: "warning",
      });
    } else {
      // 1st strike = private DM
      try {
        const embed = new EmbedBuilder()
          .setTitle("Message Removed")
          .setDescription(`Your message in **${message.guild.name}** was removed.`)
          .addFields(
            { name: "Reason", value: warning },
            { name: "Your Message", value: message.content.slice(0, 1000) }
          )
          .setFooter({ text: "This is your 1st strike. Please review the server rules." })
          .setColor(0xed4245)
          .setTimestamp();

        await message.author.send({ embeds: [embed] });
      } catch {
        // DMs might be closed, that's fine
      }

      staffLog(client, {
        title: "Strike 1 - Private Warning",
        fields: [
          { name: "User", value: message.author.tag, inline: true },
          { name: "Type", value: violation.type, inline: true },
          { name: "Matched", value: violation.matched, inline: true },
          { name: "Content", value: message.content.slice(0, 1000) },
        ],
        type: "info",
      });
    }
  },
};
