import { z } from "zod";

export const entryBaseSchema = z.object({
  date: z.string().or(z.date()),
  time: z.string().optional(),
  lugar: z.string().min(1, "Lugar es requerido"),
  relacion: z.string().min(1, "Relación es requerida"),
  actividad: z.string().min(1, "Actividad es requerida"),
  sentir: z.string().min(1, "Sentir es requerido"), // Puede ser emoji o texto
});

export const entryCreateSchema = entryBaseSchema;

export const entryUpdateSchema = entryBaseSchema.partial();

export type EntryCreateInput = z.infer<typeof entryCreateSchema>;
export type EntryUpdateInput = z.infer<typeof entryUpdateSchema>;
