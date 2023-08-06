This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment Variables

For this project to work locally you must have envirnoment variables filled out. First create a .env file in the root directory and fill it in with the proper values. Below is an example of how the file must look like.

```bash
GOOGLE_CLIENT_ID={YOUR GOOG CLIENT ID}
GOOGLE_CLIENT_SECRET={YOUR GOOGLE CLIENT SECRET}
JWT_SECRET={JWT SECRET}
NEXT_AUTH_URL=http://localhost:3000
```

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Content

Currently this project has to main pages that a use can visit. 

- [localhost:3000/](http://localhost:3000/) - home page of projet where we discuss value add and purpose of project.
- [localhost:3000/projects](http://localhost:3000/projects) - interactive page that signed in users can create their first hosted and fully functional "one click" CRUD API.
