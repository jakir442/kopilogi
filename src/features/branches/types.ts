export type BranchConcept = "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";

export type BranchDocument = {
  _id: string;
  name: string;
  slug: string;
  concept: BranchConcept;
  address: string;
  phone?: string;
  googleMapsUrl?: string;
  openingHours?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
