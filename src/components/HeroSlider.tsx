"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '@/app/actions/media';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import AnimatedView from './AnimatedView';

interface HeroSliderProps {
    photos: Photo[];
}

export default function HeroSlider({ photos }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (photos.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [photos.length]);

    if (!photos.length) return null;

    return (
        <div className={styles.heroSlider}>
            {/* Background Images - Changes with animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={photos[currentIndex].id}
                    className={styles.heroSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                >
                    <img 
                        src={photos[currentIndex].url} 
                        alt={photos[currentIndex].title || 'Featured Project'} 
                        className={styles.heroBg}
                    />
                    <div className={styles.heroOverlay} />
                </motion.div>
            </AnimatePresence>

            {/* Static Content - Stays the same */}
            <div className="container" style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
                <AnimatedView className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Delivering public projects with Quality, transparency and accountability.
                    </h1>
                    <p className={styles.heroSubtitle}>
                        The Project Implementation Bureau monitors, coordinates, and reports on government-approved projects across Abia State to ensure effective delivery, quality standards, and public accountability.
                    </p>
                    <div className={styles.heroActions}>
                        <button className="btn btn-primary">
                            View Active Projects
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <Link href="/about" className="btn btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>
                            About the Bureau
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </AnimatedView>
            </div>
            
            {photos.length > 1 && (
                <div className={styles.sliderDots}>
                    {photos.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.sliderDot} ${index === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
