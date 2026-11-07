import { Branch } from "@/features/branches/models/branch.model";

import { Menu } from "../models/menu.model";

export async function findMenusByBranch(branchId: string) {
  return Menu.find({
    branchId,
  })
    .sort({
      category: 1,
      name: 1,
    })
    .lean();
}

export async function findMenuById(menuId: string) {
  return Menu.findById(menuId).lean();
}

export async function findMenuByIdAndBranch(menuId: string, branchId: string) {
  return Menu.findOne({
    _id: menuId,
    branchId,
  }).lean();
}

export async function findMenuBySlug(branchId: string, slug: string) {
  return Menu.findOne({
    branchId,
    slug,
  }).lean();
}

export async function createMenu(data: {
  name: string;
  slug: string;
  description: string;
  category: "Kopi" | "Minuman" | "Makanan";
  price: number;
  image?: string | null;
  isAvailable: boolean;
  featured: boolean;
  priceVerified: boolean;
  branchId: string;
}) {
  return Menu.create(data);
}

export async function updateMenuByIdAndBranch(
  menuId: string,
  branchId: string,
  data: {
    name: string;
    slug: string;
    description: string;
    category: "Kopi" | "Minuman" | "Makanan";
    price: number;
    image?: string | null;
    isAvailable: boolean;
    featured: boolean;
    priceVerified: boolean;
  },
) {
  return Menu.findOneAndUpdate(
    {
      _id: menuId,
      branchId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}

export async function deleteMenuByIdAndBranch(menuId: string, branchId: string) {
  return Menu.findOneAndDelete({
    _id: menuId,
    branchId,
  }).lean();
}

export async function findPublicMenus() {
  return Menu.find({
    isAvailable: true,
  })
    .populate({
      path: "branchId",
      match: {
        isActive: true,
      },
      select: "_id name slug isActive",
    })
    .sort({
      featured: -1,
      category: 1,
      name: 1,
    })
    .lean();
}

export async function findPublicMenuBySlug(slug: string) {
  return Menu.findOne({
    slug,
    isAvailable: true,
  })
    .populate({
      path: "branchId",
      match: {
        isActive: true,
      },
      select: "_id name slug isActive",
    })
    .lean();
}

export async function findPublicMenuByBranchSlugAndSlug(branchSlug: string, slug: string) {
  const branch = await Branch.findOne({
    slug: branchSlug,
    isActive: true,
  })
    .select("_id name slug concept address phone googleMapsUrl openingHours image")
    .lean();

  if (!branch) {
    return null;
  }

  const menu = await Menu.findOne({
    branchId: branch._id,
    slug,
    isAvailable: true,
  }).lean();

  if (!menu) {
    return null;
  }

  return {
    branch,
    menu,
  };
}
