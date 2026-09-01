import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

type AppRole = "ADMIN" | "TEACHER";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role as AppRole) ?? "TEACHER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const typedUser = user as { id?: string; role?: AppRole } | undefined;

      if (typedUser) {
        token.sub = typedUser.id ?? token.sub;
        token.role = typedUser.role ?? "TEACHER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as AppRole | undefined) ?? "TEACHER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
