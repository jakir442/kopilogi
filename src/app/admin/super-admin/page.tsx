import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { SuperAdminDashboard } from "@/components/admin/super-admin/super-admin-dashboard";
import { Branch } from "@/features/branches/models/branch.model";
import { User } from "@/features/users/models/user.model";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";
import { requireAdmin } from "@/lib/auth/authorization";
import { connectToDatabase } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Super Admin | Kopilogi",
  description: "Pusat pengelolaan sistem Kopilogi.",
};

async function handleSignOut() {
  "use server";

  await signOut({ redirectTo: "/login" });
}

export default async function SuperAdminPage() {
  const session = await requireAdmin();
  const access = await getAdminBranchAccess();

  if (session.user.role !== "super_admin" || !access.isSuperAdmin) {
    redirect("/admin");
  }

  await connectToDatabase();

  const [branchDocuments, adminDocuments] = await Promise.all([
    Branch.find({}).sort({ slug: 1 }).lean().exec(),

    User.find({ role: "admin" })
      .select("name email role branchId image createdAt updatedAt")
      .populate({
        path: "branchId",
        select: "name slug concept isActive",
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec(),
  ]);

  const branches = branchDocuments.map((branch) => ({
    id: branch._id.toString(),
    name: branch.name,
    slug: branch.slug,
    concept: branch.concept,
    address: branch.address,
    phone: branch.phone ?? undefined,
    googleMapsUrl: branch.googleMapsUrl ?? undefined,
    openingHours: branch.openingHours ?? undefined,
    image: branch.image ?? undefined,
    isActive: branch.isActive,
    createdAt: new Date(branch.createdAt),
    updatedAt: new Date(branch.updatedAt),
  }));

  const admins = adminDocuments.map((admin) => {
    const branch =
      admin.branchId && typeof admin.branchId === "object" && "name" in admin.branchId
        ? {
            id: admin.branchId._id.toString(),
            name: admin.branchId.name,
            slug: admin.branchId.slug,
            concept: admin.branchId.concept,
            isActive: admin.branchId.isActive,
          }
        : null;

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      image: admin.image ?? undefined,
      branch,
      createdAt: new Date(admin.createdAt),
      updatedAt: new Date(admin.updatedAt),
    };
  });

  return (
    <SuperAdminDashboard
      name={session.user.name ?? "Super Admin"}
      email={session.user.email ?? ""}
      branches={branches}
      admins={admins}
      onSignOut={handleSignOut}
    />
  );
}
