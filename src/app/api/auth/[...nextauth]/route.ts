import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
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
        
        // Database-free architecture: Accept any email and mock a user object.
        // The session will be persisted securely via JWT cookies.
        return {
          id: email,
          name: email.split('@')[0],
          email: email,
          image: '',
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
      // Allow all sign-ins in database-free mode
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_string_for_vercel_production_12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
