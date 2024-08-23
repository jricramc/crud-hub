import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({

  // Configure the base URL
  // baseUrl: process.env.NEXTAUTH_URL || publicRuntimeConfig.NEXTAUTH_URL, // Replace with your actual base URL

  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.NEXT_PUBLIC_JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET,
});
