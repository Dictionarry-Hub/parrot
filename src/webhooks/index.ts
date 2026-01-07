import { TextChannel } from "discord.js";
import { WebhookPayload } from "../types";
import { handleChangelog } from "./changelog";
import { handleRebuild } from "./rebuild";

type Handler = (payload: WebhookPayload, channel: TextChannel) => Promise<void>;

const handlers: Record<string, Handler> = {
  changelog: handleChangelog as Handler,
  rebuild: handleRebuild as Handler,
};

export function getHandler(type: string): Handler | undefined {
  return handlers[type];
}
