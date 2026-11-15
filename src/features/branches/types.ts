
export type BranchConcept =
  | "modern-futuristic"
  | "traditional-heritage"
  | "contemporary-cozy";

export type BranchPartnership = {
  name: string;
  url?: string;
};

export type DailyOpeningHours = {
  isOpen: boolean;
  open: string;
  close: string;
};

export type WeeklyOpeningHours = {
  monday: DailyOpeningHours;
  tuesday: DailyOpeningHours;
  wednesday: DailyOpeningHours;
  thursday: DailyOpeningHours;
  friday: DailyOpeningHours;
  saturday: DailyOpeningHours;
  sunday: DailyOpeningHours;
};

export type BranchDocument = {
  _id: string;
  name: string;
  slug: string;
  concept: BranchConcept;
  address: string;
  phone?: string;
  googleMapsUrl?: string;
  weeklyOpeningHours?: WeeklyOpeningHours;
  openingHours?: string;
  openingTime?: string;
  closingTime?: string;
  partnerships?: BranchPartnership[];
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
