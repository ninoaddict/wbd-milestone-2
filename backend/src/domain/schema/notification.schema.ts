import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";

export const SubscribeSchema: RequestSchema = {
  body: z.object({
    subscription: z.object({
      endpoint: z.string().url(),
      keys: z.object({
        p256dh: z.string().min(1),
        auth: z.string().min(1),
      }),
    }),
  }),
};

export const UnsubscribeSchema: RequestSchema = {
  body: z.object({
    endpoint: z.string(),
  }),
};
