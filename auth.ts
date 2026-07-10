import { createHash } from "crypto";
import NextAuth, { type DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import { verifyCredentials, upsertGoogleUser, roleForEmail } from "@/lib/users";

/**
 * Session-signing secret. Uses AUTH_SECRET if set; otherwise derives a stable secret
 * from the database connection string (already a private env var in production, never in
 * the public repo). This lets auth work with zero extra configuration on Vercel.
 */
function resolveSecret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  const base =
    process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED;
  if (base) return createHash("sha256").update("catalyst-auth::" + base).digest("hex");
  return "catalyst-dev-only-insecure-secret";
}

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

// Social providers appear only when their credentials are configured.
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.unshift(Google({ allowDangerousEmailAccountLinking: true }));
}
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub({ allowDangerousEmailAccountLinking: true }));
}
if (process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET) {
  providers.push(LinkedIn({ allowDangerousEmailAccountLinking: true }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: resolveSecret(),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    // ensure social-login users exist in our table + carry role
    async signIn({ user, account }) {
      if ((account?.type === "oauth" || account?.type === "oidc") && user.email) {
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
