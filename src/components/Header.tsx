"use client";

import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

    // Toggle menu
    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Toggle mobile submenu
    const toggleMobileItem = (label: string) => {
        if (expandedMobileItem === label) {
            setExpandedMobileItem(null);
        } else {
            setExpandedMobileItem(label);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '#projects' },
        { label: 'About PIB', href: '/about' },
        { label: 'Media', href: '/media' },
        { label: 'Blog', href: '/blog' },
        {
            label: 'Contact',
            href: '/contact',
            children: [
                { label: 'Contact Us', href: '/contact' },
                { label: 'Reports & Feedback', href: '/reports' }
            ]
        },
    ];

    return (
        <motion.header
            className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className={styles.container}>
                {/* LEFT: Logo */}
                <div className={styles.logoArea}>
                    <Image
                        src="/Untitled-1.png"
                        alt="Abia State Government Logo"
                        width={80}
                        height={80}
                        className={styles.logoImage}
                        priority
                    />
                    <div className={`${styles.provisionalLogo} ${isScrolled ? styles.logoTextScrolled : styles.logoTextTransparent}`}>
                        Abia State Government
                        <span>Project Implementation Bureau</span>
                    </div>
                </div>

                {/* CENTER: Navigation (Desktop) */}
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <div key={item.label} className={styles.navItem}>
                            <Link href={item.href} className={styles.navLink}>
                                {item.label}
                                {item.children && (
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </Link>

                            {item.children && (
                                <div className={styles.dropdown}>
                                    {item.children.map((child) => (
                                        <Link key={child.label} href={child.href} className={styles.dropdownLink}>
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* RIGHT: Actions & Mobile Toggle */}
                <div className={styles.actions}>
                    <Link href="/admin/login" className={`btn btn-primary ${styles.ctaLink}`} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                        Login to portal
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    {/* Mobile Hamburger */}
                    <button className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`} onClick={toggleMenu}>
                        <span className={isScrolled || isMobileMenuOpen ? styles.barDark : styles.barLight}></span>
                        <span className={isScrolled || isMobileMenuOpen ? styles.barDark : styles.barLight}></span>
                        <span className={isScrolled || isMobileMenuOpen ? styles.barDark : styles.barLight}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuActive : ''}`}>
                <nav className={styles.mobileNav}>
                    {navItems.map((item) => (
                        <div key={item.label} className={styles.mobileNavItem}>
                            {item.children ? (
                                <>
                                    <div
                                        className={styles.mobileNavLink}
                                        onClick={() => toggleMobileItem(item.label)}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                    >
                                        {item.label}
                                        <svg
                                            width="12"
                                            height="8"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ transform: expandedMobileItem === item.label ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                                        >
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    {expandedMobileItem === item.label && (
                                        <div className={styles.mobileSubNav}>
                                            {item.children.map(child => (
                                                <Link key={child.label} href={child.href} className={styles.mobileSubLink} onClick={() => setIsMobileMenuOpen(false)}>
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href={item.href} className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Mobile Login Button */}
                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/admin/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Login to portal
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </nav>
            </div>
        </motion.header>
    );
}
