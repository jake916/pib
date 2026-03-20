"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'sonner';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Check if we are on the admin login page or any admin page
    const isAdminPage = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminPage && <Header />}
            {children}
            {!isAdminPage && <Footer />}
            <Toaster position="bottom-right" richColors />
        </>
    );
}
