import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { HeritageDashboard } from "@/components/admin/cabang-2/heritage-dashboard";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";
import { requireAdmin } from "@/lib/auth/authorization";
import { getMenus } from "@/features/menu/actions/menu.actions";

export const metadata: Metadata = {
  title: "Cabang 2 | Admin Kopilogi",
  description: "Dashboard administrasi Kopilogi Cabang 2.",
};

async function handleSignOut() {
  "use server";

  await signOut({
    redirectTo: "/login",
  });
}

type Cabang2AdminPageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function Cabang2AdminPage({ searchParams }: Cabang2AdminPageProps) {
  const session = await requireAdmin();

  const access = await getAdminBranchAccess("cabang-2");

  if (!access.branch) {
    redirect("/admin");
  }

  if (session.user.role !== "super_admin" && access.branch.slug !== "cabang-2") {
    redirect("/admin");
  }

  const params = await searchParams;
  const activeTab =
    params.tab === "menu" ? "menu" : params.tab === "customers" ? "customers" : "dashboard";

  const menuResult = await getMenus(String(access.branch._id));
  const menus = menuResult.success ? (menuResult.data ?? []) : [];

  return (
    <HeritageDashboard
      name={session.user.name ?? "Admin"}
      email={session.user.email ?? ""}
      branch={access.branch}
      menus={menus}
      onSignOut={handleSignOut}
      isSuperAdmin={session.user.role === "super_admin"}
      activeTab={activeTab}
    />
  );
}
