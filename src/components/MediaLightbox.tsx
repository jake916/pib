'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './MediaLightbox.module.css';

interface MediaLightboxProps {
    imageSrc: string;
    imageAlt: string;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function MediaLightbox({ imageSrc, imageAlt, onClose, onNext, onPrev }: MediaLightboxProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && onNext) onNext();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNext, onPrev]);

    return (
        <div className={styles.lightbox} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {onPrev && (
                <button className={`${styles.navButton} ${styles.prevButton}`} onClick={(e) => { e.stopPropagation(); onPrev(); }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            )}

            {onNext && (
                <button className={`${styles.navButton} ${styles.nextButton}`} onClick={(e) => { e.stopPropagation(); onNext(); }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            )}

            <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
                <Image src={imageSrc} alt={imageAlt} fill style={{ objectFit: 'contain' }} />
            </div>
        </div>
    );
}
