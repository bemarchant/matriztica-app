import { z } from "zod";

export const entryBaseSchema = z.object({
  date: z.string().or(z.date()),
  time: z.string().optional(),
  bienestar: z.number().min(1).max(5).default(3), // Nuevo: bienestar 1-5
  lugar: z.string().optional().nullable().transform((v: string | null) => v ?? undefined),
  relacion: z.string().optional().nullable().transform((v: string | null) => v ?? undefined),
  operacion: z.string().optional().nullable().transform((v: string | null) => v ?? undefined), // Reemplaza actividad
  emocion: z.string().optional().nullable().transform((v: string | null) => v ?? undefined), // Reemplaza sentir
  csi: z.string().optional().nullable().transform((v: string | null) => v ?? undefined), // Nuevo: CSI
});

export const entryCreateSchema = entryBaseSchema;

export const entryUpdateSchema = entryBaseSchema.partial();

export type EntryCreateInput = z.infer<typeof entryCreateSchema>;
export type EntryUpdateInput = z.infer<typeof entryUpdateSchema>;
