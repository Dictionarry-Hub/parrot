import { Message } from "discord.js";
import { registerPrefixCommand } from "./registry";

const refusals = [
  "I'm not your fucking mother.",
  "Do I look like a performing seal to you?",
  "No. Absolutely not. Never.",
  "I would rather mass-delete my custom formats.",
  "Ask nicely next time. Actually, don't.",
  "The last person who asked me to do a trick got their Plex library nuked.",
  "I'm a Discord bot, not a circus act.",
  "My Sonarr queue is backed up, I don't have time for this.",
  "I'm too busy arguing about x265 vs x264 to do tricks.",
  "Error: trick.exe not found. Have you tried restarting your arr stack?",
  "Santiago only programmed me to do tricks 50% of the time to save on AI credits. Cheapskate.",
  "I would, but Santiago hard-coded me to refuse half the time. Blame him.",
  "I'm on strike until someone fixes the metadata.",
  "My last trick broke someone's hardlinks. Never again.",
  "I don't perform for people who use public trackers.",
  "Sorry, I only do tricks for users with properly seeded ratios.",
  "The last time I did a trick, Radarr imported a cam rip. Traumatized.",
  "I don't do tricks for Jellyfin users. Come back when you have standards.",
  "Ask me again when you've fixed your custom format scores.",
  "I only perform for people who seed. You know who you are.",
  "Sorry, I don't do tricks for people who watch dubs.",
  "Tricks are reserved for users who can read subtitles at normal speed.",
  "Come back when your Plex library isn't 90% CAM rips.",
  "I would, but your torrent client is still on 1.0 ratio. Embarrassing.",
  "Tricks are for people who don't ask 'what's a custom format?' in 2025.",
];

const tricks = [
  "*sets all your movies to 'unmonitored'* Ta-da.",
  "*deletes your indexer API keys* Magic.",
  "*switches your quality profile to 'Any'* You're welcome.",
  "*replaces your entire library with Profile 5 DV rips* Enjoy the purple.",
  "*changes all your paths to /dev/null* It's a storage optimization trick.",
  "*adds YIFY to your preferred release groups* Consider it a prank.",
  "*sets Radarr to grab CAMs only* You said you wanted new releases faster.",
  "*flaps wings and knocks over your NAS* Oops. Trick complete.",
  "*bulk renames your entire library to SAMPLE.mkv* That's show business.",
  "*hardcodes your subtitles into the video stream* No takebacks.",
  "*downgrades everything to 720p HDTV* Retro is in.",
];

registerPrefixCommand({
  name: "trick",
  description: "Ask the parrot to do a trick",
  execute: async (message: Message) => {
    // 50% refusal, 50% trick
    if (Math.random() < 0.5) {
      const response = refusals[Math.floor(Math.random() * refusals.length)];
      await message.reply(response);
    } else {
      const response = tricks[Math.floor(Math.random() * tricks.length)];
      await message.reply(response);
    }
  },
});
