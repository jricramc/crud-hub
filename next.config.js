/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_WEBHUB_HOST: process.env.NEXT_PUBLIC_WEBHUB_HOST,
      NEXT_PUBLIC_MONGODB_API_KEY: process.env.NEXT_PUBLIC_MONGODB_API_KEY,
      // WEBHUB_DB_URL: process.env.WEBHUB_DB_URL,
    },
  };

module.exports = nextConfig
