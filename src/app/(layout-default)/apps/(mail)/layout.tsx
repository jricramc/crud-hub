"use client";
import AppMailLayout from "../../../../../demo/components/apps/mail/AppMailLayout";
import { Suspense } from "react";
interface AppMailLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppMailLayoutProps) {
    return <Suspense fallback={<>Loading...</>}>
        <AppMailLayout>{children}</AppMailLayout>;
    </Suspense>
}
