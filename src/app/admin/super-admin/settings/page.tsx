
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SuperAdminSettings } from "@/components/admin/super-admin/super-admin-settings";
import { User } from "@/features/users/models/user.model";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";
import { requireAdmin } from "@/lib/auth/authorization";
import { connectToDatabase } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Pengaturan Super Admin | Kopilogi",
  description: "Pengaturan akun Super Admin Kopilogi.",
};

export default async function SuperAdminSettingsPage() {
  const session = await requireAdmin();
  const access = await getAdminBranchAccess();

  if (session.user.role !== "super_admin" || !access.isSuperAdmin) {
    redirect("/admin");
  }

  if (!session.user.id) {
    redirect("/login");
  }

  await connectToDatabase();

  const user = await User.findOne({
    _id: session.user.id,
    role: "super_admin",
  })
    .select("name email")
    .lean();

  if (!user) {
    redirect("/login");
  }

  return (
    <SuperAdminSettings
      name={user.name}
      email={user.email}
    />
  );
}
