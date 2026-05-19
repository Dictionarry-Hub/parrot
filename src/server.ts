import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Client, NewsChannel } from "discord.js";
import { WebhookPayload } from "./types";
import { getHandler } from "./webhooks";
import { handleGitHubWebhook, GitHubWebhookPayload } from "./webhooks/github";
import { logger } from "@logger";
import { createHmac, timingSafeEqual } from "crypto";
import { createServer } from "net";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
}

function verifyGitHubSignature(payload: string, signature: string | undefined): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    logger.warn("GITHUB_WEBHOOK_SECRET not set - skipping signature verification");
    return true; // Allow if no secret configured (dev mode)
  }

  if (!signature) {
    logger.error("Missing X-Hub-Signature-256 header");
    return false;
  }

  const expected = "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

const channelMap: Record<string, string | undefined> = {
  changelog: process.env.CHANGELOG,
  release: process.env.CHANGELOG,
  rebuild: process.env.STAFF_LOG,
};

export function startServer(client: Client) {
  const app = new Hono();

  app.use("/public/*", serveStatic({ root: "./" }));

  app.post("/webhook", async (c) => {
    try {
      const payload: WebhookPayload = await c.req.json();

      const channelId = channelMap[payload.type];
      logger.debug("Webhook received", { type: payload.type, channelId, cacheSize: client.channels.cache.size });

      if (!channelId) {
        return c.json({ error: "No channel configured for this type" }, 400);
      }

      const channel = client.channels.cache.get(channelId);
      if (!channel || !(channel instanceof NewsChannel)) {
        logger.warn("Channel not found in cache", { channelId, found: !!channel });
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

  // GitHub webhook endpoint for Carrier sync
  app.post("/webhook/github", async (c) => {
    try {
      const event = c.req.header("X-GitHub-Event");
      if (!event) {
        return c.json({ error: "Missing X-GitHub-Event header" }, 400);
      }

      // Get raw body for signature verification
      const rawBody = await c.req.text();
      const signature = c.req.header("X-Hub-Signature-256");

      if (!verifyGitHubSignature(rawBody, signature)) {
        logger.error("Invalid GitHub webhook signature");
        return c.json({ error: "Invalid signature" }, 401);
      }

      const payload: GitHubWebhookPayload = JSON.parse(rawBody);
      await handleGitHubWebhook(client, payload, event);

      logger.info("GitHub webhook handled", { event });
      return c.json({ success: true });
    } catch (error) {
      logger.error("GitHub webhook error", { error });
      return c.json({ error: "Failed to process webhook" }, 500);
    }
  });

  const basePort = Number(process.env.PORT) || 3000;
  findAvailablePort(basePort).then((port) => {
    serve({ fetch: app.fetch, port });
    logger.info(`Server running on port ${port}`);
  });
}
