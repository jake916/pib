'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import FeedbackModal from './FeedbackModal';

export default function Footer() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <footer className={styles.footer}>
            {/* Pre-Footer: Feedback */}
            <div className={styles.preFooter}>
                <div className="container">
                    <div className={styles.preFooterContent}>
                        <h2 className={styles.preFooterTitle}>Report an Issue or Share Feedback</h2>
                        <p className={styles.preFooterText}>
                            The Project Implementation Bureau welcomes feedback related to projects listed on this platform.
                            If you have information about a project, concerns regarding implementation, or general feedback,
                            please submit the form below. All submissions are reviewed and handled in line with internal processes.
                        </p>
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                            Submit Feedback
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className={styles.mainFooter}>
                <div className="container">
                    <div className={styles.footerGrid}>
                        {/* Brand Column */}
                        <div className={styles.footerBrand}>
                            <div className={styles.brandContainer}>
                                <Image
                                    src="/Untitled-1.png"
                                    alt="Abia State Government Logo"
                                    width={60}
                                    height={60}
                                    className={styles.brandImage}
                                />
                                <div className={styles.brandText}>
                                    Abia State Government
                                    <span>Project Implementation Bureau</span>
                                </div>
                            </div>
                            <p>
                                Ensuring transparency, accountability, and excellence in the delivery of public infrastructure across Abia State.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className={styles.footerCol}>
                            <h4>Explore</h4>
                            <div className={styles.footerLinks}>
                                <Link href="#" className={styles.footerLink}>Home</Link>
                                <Link href="#projects" className={styles.footerLink}>Projects</Link>
                                <Link href="#media" className={styles.footerLink}>Media Gallery</Link>
                                <Link href="#blog" className={styles.footerLink}>News & Updates</Link>
                            </div>
                        </div>

                        {/* Organization */}
                        <div className={styles.footerCol}>
                            <h4>Organization</h4>
                            <div className={styles.footerLinks}>
                                <Link href="#about" className={styles.footerLink}>About Us</Link>
                                <Link href="#mandate" className={styles.footerLink}>Our Mandate</Link>
                                <Link href="#leadership" className={styles.footerLink}>Leadership</Link>
                                <Link href="#contact" className={styles.footerLink}>Contact Support</Link>
                            </div>
                        </div>

                        {/* Socials/Contact */}
                        <div className={styles.footerCol}>
                            <h4>Connect</h4>
                            <div className={styles.footerLinks}>
                                <a href="#" className={styles.footerLink}>Twitter / X</a>
                                <a href="#" className={styles.footerLink}>Facebook</a>
                                <a href="#" className={styles.footerLink}>Instagram</a>
                                <a href="#" className={styles.footerLink}>LinkedIn</a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.disclaimer}>
                        <p>
                            Project information on this platform is provided for public awareness and transparency purposes and reflects data reported through the Project Implementation Bureau’s monitoring systems.
                        </p>
                    </div>

                    <div className={styles.footerBottom}>
                        <p>&copy; {new Date().getFullYear()} Project Implementation Bureau. All rights reserved.</p>
                        <div className={styles.legalLinks}>
                            <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
                            <Link href="#" className={styles.footerLink}>Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </footer>
    );
}
