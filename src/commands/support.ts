import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  EmbedBuilder,
  ComponentType,
} from "discord.js";
import { logger } from "@logger";
import {
  REPOS,
  MODALS,
  DOCS_URL,
  RepoName,
  IssueType,
  createSupport,
} from "../carrier";

// Custom IDs for button/modal identification
const REPO_PREFIX = "support_repo_";
const TYPE_PREFIX = "support_type_";
const MODAL_PREFIX = "support_modal_";

export const command = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Create a support request (synced with GitHub)"),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // Step 1: Show repo selection buttons
    const repoRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      Object.values(REPOS).map((repo) => {
        const button = new ButtonBuilder()
          .setCustomId(`${REPO_PREFIX}${repo.name}`)
          .setLabel(repo.displayName)
          .setStyle(ButtonStyle.Secondary);

        // Use custom emoji ID if available, otherwise use emoji string
        if (repo.emojiId) {
          button.setEmoji({ id: repo.emojiId });
        } else {
          button.setEmoji(repo.emoji);
        }

        return button;
      })
    );

    const embed = new EmbedBuilder()
      .setTitle("Create Support Request")
      .setDescription("Which repository is this for?")
      .setColor(0x57f287); // Green

    const response = await interaction.reply({
      embeds: [embed],
      components: [repoRow],
      ephemeral: true,
    });

    // Wait for repo selection
    try {
      const repoInteraction = await response.awaitMessageComponent({
        componentType: ComponentType.Button,
        time: 60000, // 1 minute timeout
        filter: (i) => i.user.id === interaction.user.id,
      });

      await handleRepoSelection(repoInteraction as ButtonInteraction);
    } catch {
      await interaction.editReply({
        content: "Timed out. Run `/support` again when ready.",
        embeds: [],
        components: [],
      });
    }
  },
};

async function handleRepoSelection(interaction: ButtonInteraction): Promise<void> {
  const repo = interaction.customId.replace(REPO_PREFIX, "") as RepoName;
  const repoConfig = REPOS[repo];

  // Step 2: Show type selection buttons
  const buttons: ButtonBuilder[] = [
    new ButtonBuilder()
      .setCustomId(`${TYPE_PREFIX}${repo}_bug`)
      .setLabel("Bug Report")
      .setEmoji("🐛")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`${TYPE_PREFIX}${repo}_feature`)
      .setLabel("Feature Request")
      .setEmoji("✨")
      .setStyle(ButtonStyle.Secondary),
  ];

  // Only show Support Question if repo has discussions
  if (repoConfig.hasSupport && repoConfig.discussionsUrl) {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`${TYPE_PREFIX}${repo}_support`)
        .setLabel("Support Question")
        .setEmoji("💬")
        .setStyle(ButtonStyle.Secondary)
    );
  }

  // Always show docs
  buttons.push(
    new ButtonBuilder()
      .setCustomId(`${TYPE_PREFIX}${repo}_docs`)
      .setLabel("Check the Docs")
      .setEmoji("📚")
      .setStyle(ButtonStyle.Secondary)
  );

  const typeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  // Build title with custom emoji if available
  const titleEmoji = repoConfig.emojiId
    ? `<:${repoConfig.emoji}:${repoConfig.emojiId}>`
    : repoConfig.emoji;

  const embed = new EmbedBuilder()
    .setTitle(`${titleEmoji} ${repoConfig.displayName}`)
    .setDescription("What do you need?")
    .setColor(0x5865f2);

  await interaction.update({
    embeds: [embed],
    components: [typeRow],
  });

  // Wait for type selection
  try {
    const typeInteraction = await interaction.message.awaitMessageComponent({
      componentType: ComponentType.Button,
      time: 60000,
      filter: (i) => i.user.id === interaction.user.id,
    });

    await handleTypeSelection(typeInteraction as ButtonInteraction);
  } catch {
    await interaction.editReply({
      content: "Timed out. Run `/support` again when ready.",
      embeds: [],
      components: [],
    });
  }
}

async function handleTypeSelection(interaction: ButtonInteraction): Promise<void> {
  const [repo, type] = interaction.customId.replace(TYPE_PREFIX, "").split("_") as [
    RepoName,
    string
  ];
  const repoConfig = REPOS[repo];

  // Handle redirects
  if (type === "support") {
    const embed = new EmbedBuilder()
      .setTitle("💬 Support Question")
      .setDescription(
        `For support questions, please use GitHub Discussions:\n\n**[Open Discussion](${repoConfig.discussionsUrl})**\n\nThis helps others with similar questions find answers too!`
      )
      .setColor(0x5865f2);

    await interaction.update({
      embeds: [embed],
      components: [],
    });
    return;
  }

  if (type === "docs") {
    const embed = new EmbedBuilder()
      .setTitle("📚 Documentation")
      .setURL(DOCS_URL)
      .setDescription("Check out the documentation - most common questions are answered there!")
      .setColor(0x57f287);

    await interaction.update({
      embeds: [embed],
      components: [],
    });
    return;
  }

  // Show modal for bug/feature
  const issueType = type as IssueType;
  const modalConfig = MODALS[repo][issueType];

  const modal = new ModalBuilder()
    .setCustomId(`${MODAL_PREFIX}${repo}_${issueType}`)
    .setTitle(modalConfig.title);

  // Add fields to modal
  for (const field of modalConfig.fields) {
    const textInput = new TextInputBuilder()
      .setCustomId(field.id)
      .setLabel(field.label)
      .setPlaceholder(field.placeholder)
      .setStyle(
        field.style === "paragraph" ? TextInputStyle.Paragraph : TextInputStyle.Short
      )
      .setRequired(field.required);

    // Set max length based on style
    if (field.style === "paragraph") {
      textInput.setMaxLength(1000);
    } else {
      textInput.setMaxLength(100);
    }

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
    modal.addComponents(row);
  }

  await interaction.showModal(modal);
}

// Export modal handler for use in commands/index.ts
export async function handleSupportModal(
  interaction: ModalSubmitInteraction
): Promise<void> {
  const [repo, type] = interaction.customId.replace(MODAL_PREFIX, "").split("_") as [
    RepoName,
    IssueType
  ];

  await interaction.deferReply({ ephemeral: true });

  try {
    // Collect field values
    const fields: Record<string, string> = {};
    const modalConfig = MODALS[repo][type];

    for (const field of modalConfig.fields) {
      fields[field.id] = interaction.fields.getTextInputValue(field.id);
    }

    const title = fields.title;
    if (!title) {
      await interaction.editReply({
        content: "Title is required.",
      });
      return;
    }

    // Create the support request
    const result = await createSupport({
      client: interaction.client,
      repo,
      type,
      title,
      fields,
      discordUserId: interaction.user.id,
      discordUsername: interaction.user.username,
      discordAvatarUrl: interaction.user.displayAvatarURL(),
      guildId: interaction.guildId!,
    });

    // Success message
    const embed = new EmbedBuilder()
      .setTitle("✅ Support Request Created")
      .setDescription(
        `Your ${type === "bug" ? "bug report" : "feature request"} has been created and synced!`
      )
      .addFields(
        {
          name: "Discord Thread",
          value: `[View Thread](${result.discordThreadUrl})`,
          inline: true,
        },
        {
          name: "GitHub Issue",
          value: `[#${result.githubIssueNumber}](${result.githubIssueUrl})`,
          inline: true,
        }
      )
      .setColor(0x57f287)
      .setFooter({ text: "Replies in the thread will sync with GitHub" });

    await interaction.editReply({ embeds: [embed] });

    logger.info("Support request created via modal", {
      repo,
      type,
      user: interaction.user.tag,
      issueNumber: result.githubIssueNumber,
    });
  } catch (error) {
    logger.error("Failed to create support request", { error });

    await interaction.editReply({
      content:
        "Failed to create support request. Please try again or report this issue.",
    });
  }
}

// Check if a custom ID belongs to this command's modals
export function isSupportModal(customId: string): boolean {
  return customId.startsWith(MODAL_PREFIX);
}
