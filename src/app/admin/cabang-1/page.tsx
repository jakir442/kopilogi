import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";

import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";
import { FuturisticDashboard } from "@/components/admin/cabang-1/futuristic-dashboard";
import { getMenus } from "@/features/menu/actions/menu.actions";

export const metadata: Metadata = {
  title: "Cabang 1 | Admin Kopilogi",
  description: "Dashboard dan manajemen menu Kopilogi Cabang 1.",
};

async function handleSignOut() {
  "use server";

  await signOut({
    redirectTo: "/login",
  });
}

type Cabang1AdminPageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function Cabang1AdminPage({ searchParams }: Cabang1AdminPageProps) {
  const session = await requireAdmin();
  const access = await getAdminBranchAccess("cabang-1");

  if (!access.branch) {
    redirect("/admin");
  }

  if (session.user.role !== "super_admin" && access.branch.slug !== "cabang-1") {
    redirect("/admin");
  }

  const params = await searchParams;
  const activeTab =
    params.tab === "menu" ? "menu" : params.tab === "customers" ? "customers" : "dashboard";

  const menuResult = await getMenus(String(access.branch._id));
  const menus = menuResult.success ? (menuResult.data ?? []) : [];

  return (
    <FuturisticDashboard
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
