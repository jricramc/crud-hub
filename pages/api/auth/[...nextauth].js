import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || publicRuntimeConfig.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || publicRuntimeConfig.GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.JWT_SECRET || publicRuntimeConfig.JWT_SECRET,
});
