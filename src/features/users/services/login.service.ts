import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "../models/user.model";
import type { LoginInput } from "../schemas/login.schema";

export async function authenticateUser(input: LoginInput) {
  await connectToDatabase();

  const email = input.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    branchId: user.branchId?.toString() ?? null,
    image: user.image ?? null,
  };
}
