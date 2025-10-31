import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Obtiene el userId de la sesión actual, o el usuario de prueba en desarrollo
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id;
  }

  // En desarrollo, usar el usuario de prueba del seed
  if (process.env.NODE_ENV !== "production") {
    const testUser = await prisma.user.findFirst({
      where: { email: "test@matriztica.local" },
    });
    if (testUser) {
      return testUser.id;
    }
  }

  return null;
}

