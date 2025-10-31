import NextAuth, { type NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      name: "Email",
      server: {
        host: process.env.EMAIL_SERVER_HOST || "localhost",
        port: Number(process.env.EMAIL_SERVER_PORT || 1025),
        auth: process.env.EMAIL_SERVER_USER
          ? {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            }
          : undefined,
      },
      from: process.env.EMAIL_FROM || "no-reply@matriztica.local",
      async sendVerificationRequest({ identifier, url }) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST || "localhost",
          port: Number(process.env.EMAIL_SERVER_PORT || 1025),
          secure: false,
          auth: process.env.EMAIL_SERVER_USER
            ? {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              }
            : undefined,
        });
        const result = await transporter.sendMail({
          to: identifier,
          from: process.env.EMAIL_FROM || "no-reply@matriztica.local",
          subject: "Tu enlace de acceso",
          text: `Accede con este enlace: ${url}`,
        });
        if (!result.accepted?.length) {
          // eslint-disable-next-line no-console
          console.warn("Email no aceptado, mostrando enlace en consola:", url);
        }
      },
    }),
  ],
  session: { strategy: "database" },
  pages: {},
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);


