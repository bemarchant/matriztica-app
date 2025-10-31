import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUserId";
import { entryUpdateSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entry = await prisma.entry.findFirst({
    where: { id: params.id, userId },
    include: { domains: true, tags: { include: { tag: true } } },
  });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const parsed = entryUpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const data = parsed.data;

  const existing = await prisma.entry.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.entry.update({
    where: { id: params.id },
    data: {
      date: data.date ? new Date(data.date as any) : undefined,
      context: data.context,
      emotionPrimary: data.emotionPrimary,
      emotionIntensity: data.emotionIntensity,
      csiText: data.csiText,
      doingsText: data.doingsText,
      reflectionText: data.reflectionText,
      conversationText: data.conversationText,
      conserve: data.conserve,
      transform: data.transform,
      domains: data.domains
        ? { deleteMany: {}, create: data.domains.map((d) => ({ domain: String(d) })) }
        : undefined,
      tags: data.tags
        ? {
            deleteMany: {},
            create: data.tags.map((name) => ({
              tag: { connectOrCreate: { where: { name }, create: { name } } },
            })),
          }
        : undefined,
    },
    include: { domains: true, tags: { include: { tag: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await prisma.entry.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.entry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}


