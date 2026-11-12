import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { CozyDashboard } from "@/components/admin/cabang-3-Tutup-Permanen/cozy-dashboard";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";
import { requireAdmin } from "@/lib/auth/authorization";

export const metadata: Metadata = {
  title: "Cabang 3 | Admin Kopilogi",
  description: "Dashboard administrasi Kopilogi Cabang 3.",
};

async function handleSignOut() {
  "use server";

  await signOut({
    redirectTo: "/login",
  });
}

export default async function Cabang3AdminPage() {
  const session = await requireAdmin();
  const access = await getAdminBranchAccess();

  if (!access.isSuperAdmin && access.branch?.slug !== "cabang-3") {
    redirect("/admin");
  }

  return (
    <CozyDashboard
      name={session.user.name ?? "Admin"}
      email={session.user.email ?? ""}
      branch={access.branch}
      onSignOut={handleSignOut}
    />
  );
}
