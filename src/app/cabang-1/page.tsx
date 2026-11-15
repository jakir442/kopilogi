import { notFound } from "next/navigation";

import { getBranchBySlug } from "@/features/branches/lib/get-branch-by-slug";
import { BranchLandingPage } from "@/features/branches/components/branch-landing-page";
import { getPublicMenus } from "@/features/menu/queries/public-menu.queries";
import { getPublicBranchContents } from "@/features/content/queries/content.queries";

export default async function Cabang1Page() {
  const [branch, menus, contents] = await Promise.all([
    getBranchBySlug("cabang-1"),
    getPublicMenus(),
    getPublicBranchContents("cabang-1"),
  ]);

  if (!branch || !branch.isActive) {
    notFound();
  }

  return <BranchLandingPage branch={branch} menus={menus} contents={contents} />;
}
