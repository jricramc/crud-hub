import { Metadata } from "next";
import React from "react";
import { Suspense } from "react";
import Layout from "@/layout/layout";

import { LayoutProvider } from "@/layout/context/layoutcontext";

import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "@/styles/demo/Demos.scss";
import "@/styles/layout/layout.scss";
import AppConfig from "@/layout/AppConfig";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "PrimeReact APOLLO",
    description:
        "The ultimate collection of design-agnostic, flexible and accessible React UI Components.",
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: "device-width" },
    openGraph: {
        type: "website",
        title: "PrimeReact APOLLO-REACT",
        url: "https://www.primefaces.org/apollo-react",
        description:
            "The ultimate collection of design-agnostic, flexible and accessible React UI Components.",
        images: ["https://www.primefaces.org/static/social/apollo-react.png"],
        ttl: 604800,
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <React.Fragment>
            <Suspense fallback={<>Loading...</>}>
                <>
                    {<Layout>{children}</Layout> }
                    <AppConfig minimal />
                </>
            </Suspense>
            
        </React.Fragment>
    );
}

// "use client";
// import { LayoutProvider } from "@/layout/context/layoutcontext";

// import "primeflex/primeflex.css";
// import "primeicons/primeicons.css";
// import { PrimeReactProvider } from "primereact/api";
// import "primereact/resources/primereact.css";
// import "@/styles/demo/Demos.scss";
// import "@/styles/layout/layout.scss";

// interface RootLayoutProps {
//     children: React.ReactNode;
// }

// export default function RootLayout({ children }: RootLayoutProps) {
    // return (
    //     <html lang="en" suppressHydrationWarning>
    //         <head>
    //             <link
    //                 id="theme-link"
    //                 href={`/theme/theme-light/indigo/theme.css`}
    //                 rel="stylesheet"
    //             ></link>
    //         </head>
    //         <body>
    //             <PrimeReactProvider>
    //                 <LayoutProvider>{children}</LayoutProvider>
    //             </PrimeReactProvider>
    //         </body>
    //     </html>
//     );
// }

