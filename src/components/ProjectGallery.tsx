'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProjectGallery.module.css';

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const validImages = images && images.length > 0 ? images : ['https://archive.org/download/placeholder-image/placeholder-image.jpg'];

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImageContainer}>
                <img 
                    src={validImages[activeIndex]} 
                    alt={`${title} - view ${activeIndex + 1}`} 
                    className={styles.mainImage}
                />
                
                {validImages.length > 1 && (
                    <>
                        <button className={styles.navBtn} style={{ left: '16px' }} onClick={prevImage}>
                            <ChevronLeft size={24} />
                        </button>
                        <button className={styles.navBtn} style={{ right: '16px' }} onClick={nextImage}>
                            <ChevronRight size={24} />
                        </button>
                        
                        <div className={styles.counter}>
                            {activeIndex + 1} / {validImages.length}
                        </div>
                    </>
                )}
            </div>

            {validImages.length > 1 && (
                <div className={styles.thumbnails}>
                    {validImages.map((img, idx) => (
                        <button 
                            key={idx} 
                            className={`${styles.thumbnail} ${idx === activeIndex ? styles.activeThumbnail : ''}`}
                            onClick={() => setActiveIndex(idx)}
                        >
                            <img src={img} alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
