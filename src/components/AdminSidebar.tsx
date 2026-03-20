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
    Users,
    LogOut,
    Mail
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
    userRole: string | null;
}

export default function AdminSidebar({ userRole }: AdminSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { label: 'Home', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
        { label: 'Media', href: '/admin/media', icon: ImageIcon },
        { label: 'Blog', href: '/admin/blog', icon: FileText },
        { label: 'Feedbacks', href: '/admin/feedbacks', icon: MessageSquare },
        { label: 'Contact Form', href: '/admin/contact', icon: Mail },
        { label: 'Admins', href: '/admin/admins', icon: Users },
    ];

    const isActive = (href: string) => pathname === href;

    const isVisible = (href: string) => {
        if (!userRole || userRole === 'administrator') return true;
        
        if (href === '/admin/dashboard') return true;
        if (href === '/admin/projects' && userRole === 'project_admin') return true;
        if (href === '/admin/media' && userRole === 'media_admin') return true;
        if (href === '/admin/blog' && userRole === 'blog_admin') return true;
        if ((href === '/admin/feedbacks' || href === '/admin/contact') && userRole === 'customer_admin') return true;
        
        return false;
    };

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
                {menuItems.filter(item => isVisible(item.href)).map((item) => {
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
                <button
                    onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/admin/login';
                    }}
                    className={styles.logoutBtn}
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
