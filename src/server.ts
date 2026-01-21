import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Client, TextChannel } from "discord.js";
import { WebhookPayload } from "./types";
import { getHandler } from "./webhooks";
import { logger } from "@logger";

const channelMap: Record<string, string | undefined> = {
  changelog: process.env.CHANGELOG,
  rebuild: process.env.REBUILD,
};

export function startServer(client: Client) {
  const app = new Hono();

  app.use("/public/*", serveStatic({ root: "./" }));

  app.post("/webhook", async (c) => {
    try {
      const payload: WebhookPayload = await c.req.json();

      const channelId = channelMap[payload.type];
      if (!channelId) {
        return c.json({ error: "No channel configured for this type" }, 400);
      }

      const channel = client.channels.cache.get(channelId);
      if (!channel || !(channel instanceof TextChannel)) {
        return c.json({ error: "Channel not found" }, 404);
      }

      const handler = getHandler(payload.type);
      if (!handler) {
        return c.json({ error: "Unknown payload type" }, 400);
      }

      await handler(payload, channel);
      logger.info(`Webhook handled: ${payload.type}`);

      return c.json({ success: true });
    } catch (error) {
      logger.error("Webhook error", { error });
      return c.json({ error: "Invalid payload" }, 400);
    }
  });

  const port = Number(process.env.PORT) || 3000;
  serve({ fetch: app.fetch, port });
  logger.info(`Server running on port ${port}`);
}
