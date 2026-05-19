import { EmbedBuilder, NewsChannel } from "discord.js";
import { ReleasePayload } from "../types";
import { getRandomRemark } from "@remarks";

export async function handleRelease(
  payload: ReleasePayload,
  channel: NewsChannel
): Promise<void> {
  const { repo, version, previousVersion, compareUrl, releaseUrl, commits } =
    payload.data;

  const commitList = commits
    .map((c) => {
      const shortSha = c.sha.slice(0, 7);
      return `• [\`${shortSha}\`](${c.url}) ${c.message}`;
    })
    .join("\n");

  const repoUrl = `https://github.com/${repo}`;

  const fields = [
    { name: "Repository", value: `[\`${repo}\`](${repoUrl})`, inline: true },
    { name: "Version", value: `[\`${version}\`](${releaseUrl})`, inline: true },
  ];

  if (previousVersion) {
    fields.push({
      name: "Previous",
      value: compareUrl
        ? `[\`${previousVersion}\`](${compareUrl})`
        : `\`${previousVersion}\``,
      inline: true,
    });
  }

  if (compareUrl) {
    fields.push({
      name: "Compare",
      value: `[View changes](${compareUrl})`,
      inline: true,
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setDescription(
      `**🚀 Parrot Reports: New Release Published!**\n\n${commitList || "No commit messages"}`
    )
    .addFields(fields)
    .setFooter({ text: getRandomRemark() })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}
