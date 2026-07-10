import NextAuth, { type DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { verifyCredentials, upsertGoogleUser, roleForEmail } from "@/lib/users";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: "user" | "admin" } & DefaultSession["user"];
  }
  interface User {
    role?: "user" | "admin";
  }
}

const providers: Provider[] = [
  // Email + password
  Credentials({
    credentials: { email: {}, password: {} },
    authorize: async (creds) => {
      const email = typeof creds?.email === "string" ? creds.email : "";
      const password = typeof creds?.password === "string" ? creds.password : "";
      if (!email || !password) return null;
      const user = await verifyCredentials(email, password);
      if (!user) return null;
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },
  }),
];

// "Continue with Google" appears only when its credentials are configured.
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.unshift(Google({ allowDangerousEmailAccountLinking: true }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    // ensure Google users exist in our table + carry role
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const u = await upsertGoogleUser({ name: user.name ?? undefined, email: user.email });
        user.id = u.id;
        user.role = u.role;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.sub;
        token.role = (user as { role?: "user" | "admin" }).role ?? roleForEmail(user.email ?? "");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as "user" | "admin") ?? "user";
      }
      return session;
    },
  },
});
