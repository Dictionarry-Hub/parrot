import { EmbedBuilder, TextChannel } from "discord.js";
import { ChangelogPayload } from "../types";
import { getRandomRemark } from "@remarks";

export async function handleChangelog(
  payload: ChangelogPayload,
  channel: TextChannel
): Promise<void> {
  const { repo, author, commits } = payload.data;

  const commitList = commits
    .map((c) => {
      const shortSha = c.sha.slice(0, 7);
      return `• [\`${shortSha}\`](${c.url}) ${c.message}`;
    })
    .join("\n");

  const repoUrl = `https://github.com/${repo}`;

  const embed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setDescription(
      `**🚀 Parrot Reports: New Commits Spotted!**\n\n${commitList || "No commit messages"}`
    )
    .addFields(
      { name: "Repository", value: `[\`${repo}\`](${repoUrl})`, inline: true },
      { name: "Branch", value: `[\`${payload.data.branch}\`](${repoUrl}/tree/${payload.data.branch})`, inline: true },
      { name: "Author", value: `[\`${author}\`](https://github.com/${author})`, inline: true }
    )
    .setFooter({ text: getRandomRemark() })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}
