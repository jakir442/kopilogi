import type { DefaultSession } from "next-auth";

export type UserRole = "customer" | "admin" | "super_admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      branchId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    branchId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    branchId: string | null;
  }
}
