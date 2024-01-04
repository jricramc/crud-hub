import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default NextAuth({

  // Configure the base URL
  // baseUrl: process.env.NEXTAUTH_URL || publicRuntimeConfig.NEXTAUTH_URL, // Replace with your actual base URL

  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.NEXT_PUBLIC_JWT_SECRET || publicRuntimeConfig.NEXT_PUBLIC_JWT_SECRET,
});
