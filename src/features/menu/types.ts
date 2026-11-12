export type MenuCategory = "Kopi" | "Minuman" | "Makanan";

export type MenuItem = {
  id: string;
  branchId?: string;
  slug: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  image: string;
  featured?: boolean;
  priceVerified?: boolean;
  isAvailable?: boolean;
};

export type MenuDocument = {
  _id: string;
  branchId: string;
  slug: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  image: string;
  featured: boolean;
  priceVerified: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Menu
export type PublicMenuCategory = "Kopi" | "Minuman" | "Makanan";

export type PublicMenu = {
  id: string;
  branchId: string;
  branchName: string;
  branchSlug: string;
  slug: string;
  name: string;
  description: string;
  category: PublicMenuCategory;
  price: number;
  image: string | null;
  featured: boolean;
  priceVerified: boolean;
  isAvailable: boolean;
};
