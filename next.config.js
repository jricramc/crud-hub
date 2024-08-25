module.exports = {
    serverRuntimeConfig: {
      // Will only be available on the server side
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      JWT_SECRET: process.env.JWT_SECRET,
      AUTH_SECRET: process.env.AUTH_SECRET,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },

    publicRuntimeConfig: {
        // Will be available on both server and client
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
        NEXT_PUBLIC_WEBHUB_HOST: process.env.NEXT_PUBLIC_WEBHUB_HOST,
        NEXT_PUBLIC_WEBHUB_DB_URL: process.env.NEXT_PUBLIC_WEBHUB_DB_URL,
        NEXT_PUBLIC_MONGODB_API_KEY: process.env.NEXT_PUBLIC_MONGODB_API_KEY,
        NEXT_PUBLIC_LEDGER_API_KEY: process.env.NEXT_PUBLIC_LEDGER_API_KEY,
    },

    env: {
        test: 'test',
    },
};