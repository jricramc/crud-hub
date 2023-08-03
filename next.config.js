/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      JWT_SECRET: process.env.JWT_SECRET,
      NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
    },
  };

module.exports = nextConfig
