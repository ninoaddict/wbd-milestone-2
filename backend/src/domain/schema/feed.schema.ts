import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";
// import BadRequest from "../../errors/bad-request.error";

export const updateFeedSchema: RequestSchema = {
  body: z.object({
    content: z.string({ required_error: "z cannot be empty" }),
  }),
};
