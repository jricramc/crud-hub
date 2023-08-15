/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      JWT_SECRET: process.env.JWT_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      WEBHUB_HOST: process.env.WEBHUB_HOST,
    },
  };

module.exports = nextConfig
