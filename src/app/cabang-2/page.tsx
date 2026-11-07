import { notFound } from "next/navigation";

import { getBranchBySlug } from "@/features/branches/lib/get-branch-by-slug";
import { BranchLandingPage } from "@/features/branches/components/branch-landing-page";
import { getPublicMenus } from "@/features/menu/queries/public-menu.queries";

export default async function Cabang2Page() {
  const [branch, menus] = await Promise.all([getBranchBySlug("cabang-2"), getPublicMenus()]);

  if (!branch || !branch.isActive) {
    notFound();
  }

  return <BranchLandingPage branch={branch} menus={menus} />;
}
