import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";

export const metadata: Metadata = {
  title: "Admin | Kopilogi",
  description: "Dashboard administrasi Kopilogi.",
};

export default async function AdminPage() {
  await requireAdmin();

  const access = await getAdminBranchAccess();

  if (access.isSuperAdmin) {
    redirect("/admin/super-admin");
  }

  switch (access.branch?.slug) {
    case "cabang-1":
      redirect("/admin/cabang-1");

    case "cabang-2":
      redirect("/admin/cabang-2");

    case "cabang-3":
      redirect("/admin/cabang-3");

    case "cabang-4":
      redirect("/admin/cabang-4");

    default:
      redirect("/login");
  }
}
