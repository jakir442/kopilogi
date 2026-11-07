import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import {
  findPublicMenuByBranchSlugAndSlug,
  findPublicMenuBySlug,
  findPublicMenus,
} from "../repositories/menu.repository";

import type { PublicMenu } from "../types";

export async function getPublicMenus(): Promise<PublicMenu[]> {
  try {
    await connectToDatabase();

    const menus = await findPublicMenus();

    return menus
      .filter((menu) => menu.branchId)
      .map((menu) => ({
        id: String(menu._id),
        branchId: String(menu.branchId._id),
        branchName: menu.branchId.name,
        branchSlug: menu.branchId.slug,
        slug: menu.slug,
        name: menu.name,
        description: menu.description,
        category: menu.category,
        price: menu.price,
        image: menu.image ?? null,
        featured: menu.featured,
        priceVerified: menu.priceVerified,
        isAvailable: menu.isAvailable,
      }));
  } catch (error) {
    console.error("[getPublicMenus]", error);
    return [];
  }
}

export async function getPublicMenuBySlug(slug: string): Promise<PublicMenu | null> {
  try {
    await connectToDatabase();

    const menu = await findPublicMenuBySlug(slug);

    if (!menu || !menu.branchId) {
      return null;
    }

    return {
      id: String(menu._id),
      branchId: String(menu.branchId._id),
      branchName: menu.branchId.name,
      branchSlug: menu.branchId.slug,
      slug: menu.slug,
      name: menu.name,
      description: menu.description,
      category: menu.category,
      price: menu.price,
      image: menu.image ?? null,
      featured: menu.featured,
      priceVerified: menu.priceVerified,
      isAvailable: menu.isAvailable,
    };
  } catch (error) {
    console.error("[getPublicMenuBySlug]", error);
    return null;
  }
}

export async function getPublicMenuByBranchAndSlug(branchSlug: string, menuSlug: string) {
  try {
    await connectToDatabase();

    const result = await findPublicMenuByBranchSlugAndSlug(branchSlug, menuSlug);

    if (!result) return null;

    const { branch, menu } = result;

    return {
      branch: {
        id: String(branch._id),
        name: branch.name,
        slug: branch.slug,
        concept: branch.concept,
        address: branch.address,
        phone: branch.phone ?? null,
        googleMapsUrl: branch.googleMapsUrl ?? null,
        openingHours: branch.openingHours ?? null,
        image: branch.image ?? null,
      },
      menu: {
        id: String(menu._id),
        branchId: String(menu.branchId),
        branchName: branch.name,
        branchSlug: branch.slug,
        slug: menu.slug,
        name: menu.name,
        description: menu.description,
        category: menu.category,
        price: menu.price,
        image: menu.image ?? null,
        featured: menu.featured,
        priceVerified: menu.priceVerified,
        isAvailable: menu.isAvailable,
      },
    };
  } catch (error) {
    console.error("[getPublicMenuByBranchAndSlug]", error);
    return null;
  }
}
