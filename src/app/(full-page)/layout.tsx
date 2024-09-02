import { Metadata } from "next";
import React from "react";
import { Suspense } from "react";
import AppConfig from "../../../layout/AppConfig";

interface FullPageLayoutProps {
    children: React.ReactNode;
}

// export const metadata: Metadata = {
//     title: "PrimeReact APOLLO",
//     description:
//         "The ultimate collection of design-agnostic, flexible and accessible React UI Components.",
// };

export default function FullPageLayout({ children }: FullPageLayoutProps) {
    return (
        <React.Fragment>
            <Suspense fallback={<>Loading...</>}>
                {children}
                <AppConfig minimal />
            </Suspense>
            
        </React.Fragment>
    );
}
