import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUserId";
import { entryCreateSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const emotion = searchParams.get("emotion");
  const domain = searchParams.get("domain");
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");

  const where: any = { userId };
  if (from || to) where.date = { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined };
  if (emotion) where.emotionPrimary = emotion;
  if (domain) where.domains = { some: { domain } };
  if (tag) where.tags = { some: { tag: { name: tag } } };
  if (q)
    where.OR = [
      { context: { contains: q, mode: "insensitive" } },
      { csiText: { contains: q, mode: "insensitive" } },
      { doingsText: { contains: q, mode: "insensitive" } },
      { reflectionText: { contains: q, mode: "insensitive" } },
      { conversationText: { contains: q, mode: "insensitive" } },
      { conserve: { contains: q, mode: "insensitive" } },
      { transform: { contains: q, mode: "insensitive" } },
    ];

  const entries = await prisma.entry.findMany({
    where,
    include: { domains: true, tags: { include: { tag: true } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const parsed = entryCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const data = parsed.data;

  const created = await prisma.entry.create({
    data: {
      userId,
      date: new Date(data.date as any),
      context: data.context,
      emotionPrimary: data.emotionPrimary,
      emotionIntensity: data.emotionIntensity,
      csiText: data.csiText,
      doingsText: data.doingsText,
      reflectionText: data.reflectionText,
      conversationText: data.conversationText,
      conserve: data.conserve,
      transform: data.transform,
      domains: { create: data.domains.map((d) => ({ domain: String(d) })) },
      tags: {
        create: data.tags.map((name) => ({
          tag: { connectOrCreate: { where: { name }, create: { name } } },
        })),
      },
    },
    include: { domains: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json(created, { status: 201 });
}


