export type UserRole = "customer" | "admin" | "super_admin";

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  branchId?: string | null;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};
