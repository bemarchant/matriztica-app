import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const emociones = ["alegría", "miedo", "rabia", "tristeza", "calma", "ansiedad", "esperanza"];
const contextos = [
  "Reunión de equipo",
  "Conversación con compañero",
  "Momento de reflexión",
  "Interacción con cliente",
  "Revisión de código",
  "Planificación semanal",
];
const relaciones = ["tecnico", "emocional", "relacional"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpiar datos existentes (opcional)
  console.log("🧹 Limpiando datos existentes...");
  await prisma.entryTag.deleteMany();
  await prisma.entryDomain.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.tag.deleteMany();

  // Crear usuario de prueba si no existe
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@matriztica.local",
        name: "Usuario de Prueba",
      },
    });
    console.log("✅ Usuario creado:", user.email);
  }

  // Crear tags comunes
  const tags = await Promise.all(
    ["trabajo", "personal", "familia", "proyecto", "reflexión"].map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
  console.log(`✅ ${tags.length} tags creados`);

  // Crear entradas ficticias para los últimos 30 días
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 30);

  const entries = [];
  for (let i = 0; i < 50; i++) {
    const date = randomDate(startDate, today);
    const emotion = randomItem(emociones);
    const intensity = randomInt(1, 5);
    const domains = [
      randomItem(relaciones),
      ...(Math.random() > 0.5 ? [randomItem(relaciones)] : []),
    ].filter((v, i, a) => a.indexOf(v) === i); // Eliminar duplicados

    const entry = await prisma.entry.create({
      data: {
        userId: user.id,
        date,
        context: Math.random() > 0.3 ? randomItem(contextos) : null,
        emotionPrimary: emotion,
        emotionIntensity: intensity,
        csiText: `Coherencias reconocidas entre sentir-hacer-decir en este momento de ${emotion}.`,
        doingsText: `Haceres del día relacionados con ${emotion}.`,
        reflectionText: `Reflexión sobre cómo hago lo que hago cuando siento ${emotion}.`,
        conversationText: Math.random() > 0.5 ? `Conversación a abrir sobre ${emotion}` : null,
        conserve: Math.random() > 0.6 ? `Conservar esta práctica relacionada con ${emotion}` : null,
        transform: Math.random() > 0.6 ? `Transformar este aspecto relacionado con ${emotion}` : null,
        domains: {
          create: domains.map((domain) => ({ domain })),
        },
        tags: {
          create: (() => {
            const selectedTags = [randomItem(tags)];
            if (Math.random() > 0.5) {
              const otherTag = randomItem(tags.filter((t) => t.id !== selectedTags[0]!.id));
              if (otherTag) selectedTags.push(otherTag);
            }
            return selectedTags.map((tag) => ({
              tag: { connect: { id: tag.id } },
            }));
          })(),
        },
      },
    });
    entries.push(entry);
  }

  console.log(`✅ ${entries.length} entradas creadas`);
  console.log("🎉 Seed completado!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

