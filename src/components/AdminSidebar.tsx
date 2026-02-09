"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    Image as ImageIcon,
    FileText,
    MessageSquare,
    LogOut
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: 'Home', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
        { label: 'Media', href: '/admin/media', icon: ImageIcon },
        { label: 'Blog', href: '/admin/blog', icon: FileText },
        { label: 'Feedbacks', href: '/admin/feedbacks', icon: MessageSquare },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea}>
                <Image
                    src="/Untitled-1.png"
                    alt="Abia State Govt"
                    width={40}
                    height={40}
                />
                <div className={styles.logoText}>
                    Abia State
                    <span>Admin Portal</span>
                </div>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <Link href="/" className={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </Link>
            </div>
        </aside>
    );
}
