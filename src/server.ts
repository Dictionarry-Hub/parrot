import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Client, TextChannel } from "discord.js";
import { WebhookPayload } from "./types";
import { getHandler } from "./webhooks";
import { logger } from "@logger";

export function startServer(client: Client) {
  const app = new Hono();

  app.post("/webhook", async (c) => {
    try {
      const payload: WebhookPayload = await c.req.json();

      const channel = client.channels.cache.get(payload.channel);
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
