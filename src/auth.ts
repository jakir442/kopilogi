import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/features/users/schemas/login.schema";
import { authenticateUser } from "@/features/users/services/login.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "nama@email.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Masukkan password",
        },
      },

      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        return authenticateUser(result.data);
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.branchId = user.branchId ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }

        if (token.role === "customer" || token.role === "admin" || token.role === "super_admin") {
          session.user.role = token.role;
        }

        session.user.branchId = typeof token.branchId === "string" ? token.branchId : null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
