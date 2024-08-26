import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeAPIUserPasskey } from "@/utils/server/apiCalls";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        api_id: { label: "API ID", type: "text" },
        api_user_passkey: { label: "API User Passkey", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await authorizeAPIUserPasskey({
            api_id: credentials?.api_id,
            api_user_passkey: credentials?.api_user_passkey,
          });

          const { authorized, user } = res || {};

          if (authorized) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,

  jwt: {
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
    raw: true,
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.LEDGER_API_KEY = process.env.NEXT_PUBLIC_LEDGER_API_KEY;
      return session;
    },
  },

  pages: {
    signIn: "/auth/register",
  },

});
