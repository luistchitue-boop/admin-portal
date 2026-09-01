import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "ADMIN" | "TEACHER";
    };
  }

  interface User {
    id: string;
    role: "ADMIN" | "TEACHER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "TEACHER";
  }
}

export {};
