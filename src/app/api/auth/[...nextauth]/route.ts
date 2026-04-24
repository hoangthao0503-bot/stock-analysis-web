import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split('@')[0],
              image: '',
            }
          });
        }

        // Update last login
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          });
        } catch (e) {
          console.error("Failed to update lastLogin", e);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    }),
  ],
  pages: {
    signIn: '/dang-nhap',
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 365 * 24 * 60 * 60, // 10 years
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
          if (existingUser) {
             await prisma.user.update({
              where: { email: user.email },
              data: { lastLogin: new Date() }
            });
          }
        } catch (error) {
          console.error("Error updating lastLogin:", error);
        }
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_string_for_vercel_production_12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
