import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your own authentication logic
        if (credentials.LEDGER_API_KEY === process.env.NEXT_PUBLIC_LEDGER_API_KEY) {
          console.log(credentials?.ledger_entry);
          return JSON.parse(credentials?.ledger_entry);
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback: ", { token, user });
      if (user) {
        token.user = user
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback: ", { session, token });
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/auth/register",
  },
});
