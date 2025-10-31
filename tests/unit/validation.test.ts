import { describe, it, expect } from "vitest";
import { entryCreateSchema } from "@/lib/validation";

describe("entryCreateSchema", () => {
  it("valida entrada mínima válida", () => {
    const data = {
      date: new Date().toISOString(),
      emotionPrimary: "alegría",
      emotionIntensity: 3,
      csiText: "coherencias",
      doingsText: "haceres",
      reflectionText: "reflexión",
      domains: ["emocional"],
      tags: [],
    };
    const r = entryCreateSchema.safeParse(data);
    expect(r.success).toBe(true);
  });

  it("rechaza intensidad fuera de rango", () => {
    const r = entryCreateSchema.safeParse({
      date: new Date().toISOString(),
      emotionPrimary: "miedo",
      emotionIntensity: 10,
      csiText: "x",
      doingsText: "x",
      reflectionText: "x",
      domains: ["emocional"],
      tags: [],
    });
    expect(r.success).toBe(false);
  });

  it("requiere emoción primaria", () => {
    const r = entryCreateSchema.safeParse({
      date: new Date().toISOString(),
      emotionIntensity: 3,
      csiText: "x",
      doingsText: "x",
      reflectionText: "x",
      domains: ["emocional"],
      tags: [],
    } as any);
    expect(r.success).toBe(false);
  });

  it("acepta campos opcionales nulos", () => {
    const r = entryCreateSchema.safeParse({
      date: new Date().toISOString(),
      emotionPrimary: "calma",
      emotionIntensity: 1,
      csiText: "x",
      doingsText: "x",
      reflectionText: "x",
      conversationText: null,
      conserve: null,
      transform: null,
      domains: ["tecnico"],
      tags: [],
    });
    expect(r.success).toBe(true);
  });

  it("requiere al menos un dominio", () => {
    const r = entryCreateSchema.safeParse({
      date: new Date().toISOString(),
      emotionPrimary: "rabia",
      emotionIntensity: 2,
      csiText: "x",
      doingsText: "x",
      reflectionText: "x",
      domains: [],
      tags: [],
    });
    expect(r.success).toBe(false);
  });

  it("normaliza fecha string", () => {
    const r = entryCreateSchema.safeParse({
      date: new Date().toISOString().slice(0,10),
      emotionPrimary: "alegría",
      emotionIntensity: 3,
      csiText: "x",
      doingsText: "x",
      reflectionText: "x",
      domains: ["emocional"],
      tags: [],
    });
    expect(r.success).toBe(true);
  });
});


