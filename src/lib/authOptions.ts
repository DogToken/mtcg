import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { compare } from "bcryptjs";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  interface User {
    role?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    image?: string;
  }
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const users = client.db().collection("users");
        const user = await users.findOne({ email: credentials?.email });
        
        if (user && user.password) {
          const isValid = await compare(credentials!.password, user.password);
          if (isValid) {
            return { id: user._id.toString(), email: user.email, name: user.name, image: user.image, role: user.role || 'user' };
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async session({ session, token, user }: { session: Session, token: JWT, user?: unknown }) {
      if (session.user) {
        if (token && typeof token === 'object' && 'image' in token && typeof token.image === 'string') {
          session.user.image = token.image;
        }
        if (user && typeof user === 'object' && 'image' in user && typeof (user as { image?: unknown }).image === 'string') {
          session.user.image = (user as { image: string }).image;
        }
        if (token && typeof token === 'object' && 'role' in token && typeof (token as { role?: unknown }).role === 'string') {
          session.user.role = (token as { role: string }).role;
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT, user?: unknown }) {
      if (user && typeof user === 'object' && 'image' in user && typeof (user as { image?: unknown }).image === 'string') {
        token.image = (user as { image: string }).image;
      }
      if (user && typeof user === 'object' && 'role' in user && typeof (user as { role?: unknown }).role === 'string') {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 