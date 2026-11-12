import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type AppRole = "customer" | "admin" | "super_admin";

type RequireRoleOptions = {
  roles: AppRole[];
};

export async function requireRole({ roles }: RequireRoleOptions) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!roles.includes(session.user.role)) {
    redirect("/akun");
  }

  return session;
}

export async function requireAdmin() {
  return requireRole({
    roles: ["admin", "super_admin"],
  });
}

export async function requireSuperAdmin() {
  return requireRole({
    roles: ["super_admin"],
  });
}
