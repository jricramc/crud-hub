import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeAPIUserPasskey } from "@/utils/server/apiCalls";
import { mergeDeep } from "@/utils/utils";

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
    async jwt(args) {
      console.log('jwt args: ', args);
      const { token, user, trigger, session } = args;
      if (user) {
        token.user = user
      }

      if (trigger === "update" && session?.user && token?.user) {
        const targetUser = token.user;
        const sourceUser = session?.user;
        const mergeDeepRes = mergeDeep(targetUser, sourceUser);
        console.log('mergeDeepRes: ', mergeDeepRes);
        console.log("targetUser: ", targetUser);
        token.user = targetUser;
      }

      console.log('new token: ', token);

      return token;
    },
    async session(args) {
      console.log('session args: ', args);
      const { session, token } = args;
      session.user = token.user;
      session.LEDGER_API_KEY = process.env.NEXT_PUBLIC_LEDGER_API_KEY;
      return session;
    },
  },

  pages: {
    signIn: "/auth/register",
  },

});
