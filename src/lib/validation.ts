import { z } from "zod";

export const entryBaseSchema = z.object({
  date: z.string().or(z.date()),
  context: z.string().optional().nullable().transform((v) => v ?? undefined),
  emotionPrimary: z.string().min(2),
  emotionIntensity: z.number().int().min(1).max(5),
  csiText: z.string().min(1),
  doingsText: z.string().min(1),
  reflectionText: z.string().min(1),
  conversationText: z.string().optional().nullable().transform((v) => v ?? undefined),
  conserve: z.string().optional().nullable().transform((v) => v ?? undefined),
  transform: z.string().optional().nullable().transform((v) => v ?? undefined),
  domains: z.array(z.enum(["tecnico", "emocional", "relacional"]).or(z.string())).min(1),
  tags: z.array(z.string()).default([]),
});

export const entryCreateSchema = entryBaseSchema;

export const entryUpdateSchema = entryBaseSchema.partial();

export type EntryCreateInput = z.infer<typeof entryCreateSchema>;
export type EntryUpdateInput = z.infer<typeof entryUpdateSchema>;


