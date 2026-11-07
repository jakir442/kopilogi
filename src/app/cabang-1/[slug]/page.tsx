import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicMenuDetail } from "@/features/menu/components/public-menu-detail";
import { getPublicMenuByBranchAndSlug } from "@/features/menu/queries/public-menu.queries";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const data = await getPublicMenuByBranchAndSlug("cabang-1", slug);

  if (!data) {
    return {
      title: "Menu tidak ditemukan | Kopilogi",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${data.menu.name} | ${data.branch.name} - Kopilogi`,
    description: data.menu.description,
  };
}

export default async function Cabang1MenuDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await getPublicMenuByBranchAndSlug("cabang-1", slug);

  if (!data) {
    notFound();
  }

  return <PublicMenuDetail data={data} />;
}
