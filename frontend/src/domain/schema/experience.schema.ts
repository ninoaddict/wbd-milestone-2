import { parseDate } from "@/lib/utils";
import { X } from "lucide-react";
import { z } from "zod";

export const addExperienceSchema = z
  .object({
    title: z
      .string({ required_error: "Job title cannot be empty" })
      .min(3, { message: "Job title must be at least 3 characters" }),
    company: z
      .string({ required_error: "Company name cannot be empty" })
      .min(3, { message: "Company name must be at least 3 characters" }),
    location: z
      .string({ required_error: "Location cannot be empty" })
      .min(3, { message: "Location must be at least 3 characters" }),
    stillWorking: z.boolean({
      required_error: "Still working cannot be empty",
    }),
    startMonth: z.string({ required_error: "Start month cannot be empty" }),
    startYear: z.string({ required_error: "Start year cannot be empty" }),
    endMonth: z.string({ required_error: "End month cannot be empty" }),
    endYear: z.string({ required_error: "End Year cannot be empty" }),
  })
  .superRefine((data, ctx) => {
    const startDateStr = data.startMonth + " " + data.startYear;
    const endDateStr = data.endMonth + " " + data.endYear;
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);
    if (startDate > endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startMonth"],
        fatal: true,
        message: "Start date cannot be earlier than end date",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startYear"],
        fatal: true,
        message: "Start date cannot be earlier than end date",
      });
    }
  });
