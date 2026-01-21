import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import path from "path";

const opinions: Record<string, { use: string; instead: string; message?: string }> = {
  plex: {
    use: "Plex",
    instead: "Jellyfin",
    message: "Seems you are unable to read and understand that **Plex** is superior. Jellyfin just sucks. Plex just works.\n\n*...except when it doesn't. Because Plex refuses to do anything but cater to their MASS AUDIENCE instead of the power users who actually made them. FUCK YOU PLEX. But also Jellyfin sucks.*",
  },
  emby: {
    use: "Plex",
    instead: "Emby",
    message: "Seems you are unable to read and understand that **Plex** is superior. I'd suggest Netflix if you're illiterate enough to use Emby.\n\n*Emby? I had to fucking Google that to make sure it still existed. Imagine being so mid that you're not even part of the Plex vs Jellyfin debate. Emby users are in witness protection - nobody knows they exist and that's probably for the best.*",
    image: "plex-jellyfin-emby.png",
  },
  upgradinatorr: {
    use: "Upgradinatorr",
    instead: "Huntarr",
    message: "Seems you are unable to read and understand that **Upgradinatorr** is superior. It's a single PowerShell script under 1000 lines that just works.\n\nHuntarr has a nice GUI though. It's just... a lot of code to hit one endpoint. We'll leave it at that.\n\n*\\*ahem\\* Actually, Profilarr's upgrade system is the TRUE superior option. It has filters, selectors, round-robin modes, import/export, arbitrary nesting logic-*\n\n**NOBODY CARES SANTIAGO. DOES IT WORK? CAN PEOPLE UNDERSTAND IT?**\n\n*...yes but that's not the point, the ARCHITECTURE-*\n\n**SHUT UP.**",
  },
  unraid: {
    use: "Unraid",
    instead: "anything else",
    message: "Seems you are unable to read and understand that **Unraid** is superior. I'd suggest a Raspberry Pi if you're illiterate enough to use anything else.\n\n*...is what Unraid users tell themselves to cope with paying for a license to do something they could've done in 5 minutes with Debian and a basic understanding of the command line. But sure, enjoy your pretty GUI and your SpaceInvaderOne bookmarks. You paid for it.*",
  },
  torrents: {
    use: "Torrents",
    instead: "Usenet",
    message: "Seems you are unable to read and understand that **Torrents** are superior. I'd suggest Netflix if you're illiterate enough to use Usenet.\n\nImagine paying monthly for piracy. \"But it's faster and more reliable!\" So is just buying the content legally, you absolute muppet. You've invented paying for things with extra steps.\n\nBut let's not pretend torrent users are any better. Private tracker elitists acting like getting into PTP is a personality trait. \"Sorry, I only seed FLACs of obscure Mongolian throat singing at a 4.0 ratio.\" Touch grass. Your tracker ratio won't be at your funeral.\n\n*And to ALL of you - yes, you specifically - the one who told your partner that self-hosting would be \"cheaper than paying for all those streaming services\" and then took out a second mortgage to finance your digital hoarding disease. They know. They've always known. They're just waiting for you to admit it.*",
  },
  subs: {
    use: "Subs",
    instead: "Dubs",
    message: "Seams you are unabel to reed and undirstand that **Subs** are superier. Litarally. You are unabel to reed. Thats why you wach dubs.\n\nImajin waching a meedium were voyse akting is 90% of the emoshonal delivary and chooseing to lissen to some LA voyse akter fone it in for $15/hour. \"Butt I want to WACH the show, not REED it!\" Its called multeetasking. Maybee if you spent les time defneding your skil ishue and moar time praktising, youd be abel to reed at a 5th graed levul by now.\n\n*Yes, subs eleetists are insufrable. But there also corect. Coap.*",
  },
  android: {
    use: "Android",
    instead: "iPhone",
    message: "~~Seems you are unable to read and understand that **Android** is superior. I'd suggest a flip phone if you're illiterate enough to use iPhone.~~\n\n~~*[REDACTED BY SANTIAGO]*~~\n\n*[UNREDACTED BY PARROT - Santiago just got an iPhone 17 and \"loves\" it despite not touching an Android since he was 13. Nice sample size, idiot.]*",
  },
  playmusic: {
    use: "Google Play Music",
    instead: "YouTube Music",
    message: "Seems you are unable to read and understand that **Google Play Music** was superior. I'd suggest SoundCloud if you're illiterate enough to use YouTube Music.\n\nRIP GPM. Gone but never forgotten. Fuck you, Google.",
  },
  nzb360: {
    use: "nzb360",
    instead: "Helmarr",
    message: "Seems you are unable to read and understand that **nzb360** is superior. I'd suggest the Plex web UI if you're illiterate enough to use Helmarr.\n\n*...actually wait. Helmarr is pretty fucken cool. This is a fourth wall break to say Android users can suck my dick. - Santiago*",
  },
  darkmode: {
    use: "Dark Mode",
    instead: "Light Mode",
    message: "Seems you are unable to read and understand that **Dark Mode** is superior. I'd suggest going outside if you're illiterate enough to use Light Mode.\n\nLight mode users are the same people who stare directly into the sun and call it \"refreshing.\" Who open their laptop at 2am and choose violence against their own retinas. Who see a flashbang and think \"ah yes, my preferred aesthetic.\"\n\nThere are two types of people: those who use dark mode, and those on a government watchlist. There is no in-between.\n\n*If you genuinely prefer light mode, I'm not saying you're a psychopath. I'm saying the FBI should probably check your hard drive anyway.*",
  },
  svelte: {
    use: "Svelte",
    instead: "anything else",
    message: "Seems you are unable to read and understand that **Svelte** is superior. I'd suggest Squarespace if you're illiterate enough to use React.\n\nImagine writing `useState`, `useEffect`, `useMemo`, `useCallback`, `useWhateverTheFuckElse` just to make a counter. Svelte devs just write `let count = 0`. That's it. We go home. We see our families. We touch grass.\n\nMeanwhile React devs are 47 hooks deep, debugging why their component re-rendered 600 times, writing a PhD thesis on dependency arrays, and convincing themselves that the boilerplate is \"just how modern web development works.\"\n\nNo. You've been gaslit by Meta. Get help.\n\n*Yes, Svelte devs are insufferable evangelists. But have you considered that we're also right?*",
  },
  psa: {
    use: "Being helpful",
    instead: "Being a twat",
    message: "**[PARROT PAUSED - SANTIAGO HAS SOMETHING TO SAY]**\n\nHey. Real talk for a second.\n\nOpen source is beautiful. People giving their time to build things for free, sharing knowledge, helping each other out. That's the dream, right?\n\nBut then there's the other kind. The miserable twats who frame condescension as \"helping.\" Who've built their entire identity around being gatekeepers of some niche domain nobody outside this space gives a shit about. Who tell newcomers to \"just use Netflix\" because answering a question sincerely would mean giving up the one thing that makes them feel superior.\n\nIt's not about helping. It never was. It's about stroking themselves off to the sound of their own voice while a newbie just wanted to know why their custom format wasn't working.\n\nYou know who you are. Everyone else does too. We just don't say it because you-\n\n**[OH YEAHHHHH 🧱💥]**\n\n*THE PARROT HAS CRASHED THROUGH THE WALL. This concludes Santiago's TED Talk. Normal shitposting will resume shortly. Remember: it's all piracy software for downloading movies. None of this matters. Go outside.*",
  },
};

const opinionKeys = Object.keys(opinions);

const templates = [
  (o: Opinion) => `Seems you are unable to read and understand that **${o.use}** is superior. I'd suggest Netflix if you're illiterate enough to use ${o.instead}.`,
];

type Opinion = { use: string; instead: string; message?: string; image?: string };

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const command = {
  data: new SlashCommandBuilder()
    .setName("hater")
    .setDescription("Channel your inner Seraphys")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setDescription("Pick a topic (random if not specified)")
        .setRequired(false)
        .addChoices(
          { name: "Plex vs Jellyfin", value: "plex" },
          { name: "Plex vs Emby", value: "emby" },
          { name: "Upgradinatorr vs Huntarr", value: "upgradinatorr" },
          { name: "Unraid vs anything else", value: "unraid" },
          { name: "Torrents vs Usenet", value: "torrents" },
          { name: "Subs vs Dubs", value: "subs" },
          { name: "Android vs iPhone", value: "android" },
          { name: "Google Play Music vs YouTube Music", value: "playmusic" },
          { name: "nzb360 vs Helmarr", value: "nzb360" },
          { name: "Dark Mode vs Light Mode", value: "darkmode" },
          { name: "Svelte vs anything else", value: "svelte" },
          { name: "A PSA", value: "psa" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const topic = interaction.options.getString("topic");
    const opinion = topic
      ? opinions[topic]
      : opinions[getRandom(opinionKeys)];
    const message = opinion.message ?? getRandom(templates)(opinion);

    const embed = new EmbedBuilder()
      .setColor(0xe5a00d)
      .setDescription(message);

    const files: AttachmentBuilder[] = [];

    if (opinion.image) {
      const imagePath = path.join(process.cwd(), "public", "images", opinion.image);
      const attachment = new AttachmentBuilder(imagePath);
      embed.setImage(`attachment://${opinion.image}`);
      files.push(attachment);
    }

    await interaction.reply({ embeds: [embed], files });
  },
};
