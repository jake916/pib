'use client';

import { useState } from 'react';
import styles from './media.module.css';
import AnimatedView from '@/components/AnimatedView';
import Image from 'next/image';
import MediaLightbox from '@/components/MediaLightbox';
import VideoModal from '@/components/VideoModal';

type MediaType = 'image' | 'video';
type FilterType = 'all' | 'images' | 'videos';

interface MediaItem {
    id: number;
    type: MediaType;
    src: string;
    thumbnail?: string;
    title: string;
    date: string;
}

export default function MediaPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [lightboxImage, setLightboxImage] = useState<number | null>(null);
    const [videoModal, setVideoModal] = useState<string | null>(null);

    // Sample media data - replace with actual data
    const mediaItems: MediaItem[] = [
        {
            id: 1,
            type: 'image',
            src: '/media_bridge_construction_1770377528457.png',
            title: 'Bridge Construction Project',
            date: 'February 2026'
        },
        {
            id: 2,
            type: 'image',
            src: '/media_tech_hub_1770377634654.png',
            title: 'Technology Hub Development',
            date: 'January 2026'
        },
        {
            id: 3,
            type: 'image',
            src: '/media_housing_estate_1770377950876.png',
            title: 'Housing Estate Project',
            date: 'January 2026'
        },
        {
            id: 4,
            type: 'video',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail: '/media_urban_plaza_1770377578625.png',
            title: 'Urban Plaza Development - Progress Update',
            date: 'January 2026'
        },
        {
            id: 5,
            type: 'image',
            src: '/media_modern_market_1770377935100.png',
            title: 'Modern Market Complex',
            date: 'December 2025'
        },
        {
            id: 6,
            type: 'video',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnail: '/abia_state_landscape_1770455748660.png',
            title: 'Abia State Infrastructure Overview',
            date: 'December 2025'
        },
        {
            id: 7,
            type: 'image',
            src: '/media_solar_grid_1770377546448.png',
            title: 'Solar Power Grid Installation',
            date: 'December 2025'
        },
        {
            id: 8,
            type: 'video',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: '/mandate_inspection_1770377294088.png',
            title: 'Project Inspection and Monitoring',
            date: 'November 2025'
        },
        {
            id: 9,
            type: 'image',
            src: '/media_water_project_1770377595144.png',
            title: 'Water Infrastructure Project',
            date: 'November 2025'
        }
    ];

    const filteredMedia = mediaItems.filter(item => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'images') return item.type === 'image';
        if (activeFilter === 'videos') return item.type === 'video';
        return true;
    });

    const imageItems = mediaItems.filter(item => item.type === 'image');

    const handleNextImage = () => {
        if (lightboxImage === null) return;
        const currentIndex = imageItems.findIndex(item => item.id === lightboxImage);
        const nextIndex = (currentIndex + 1) % imageItems.length;
        setLightboxImage(imageItems[nextIndex].id);
    };

    const handlePrevImage = () => {
        if (lightboxImage === null) return;
        const currentIndex = imageItems.findIndex(item => item.id === lightboxImage);
        const prevIndex = (currentIndex - 1 + imageItems.length) % imageItems.length;
        setLightboxImage(imageItems[prevIndex].id);
    };

    return (
        <main>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <AnimatedView className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Media Gallery</h1>
                        <p className={styles.heroSubtitle}>
                            View photos and videos of our ongoing and completed projects across Abia State
                        </p>
                    </AnimatedView>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className={styles.filterSection}>
                <div className="container">
                    <div className={styles.filterTabs}>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All Media
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'images' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('images')}
                        >
                            Images
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'videos' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('videos')}
                        >
                            Videos
                        </button>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className={styles.gallerySection}>
                <div className="container">
                    {filteredMedia.length > 0 ? (
                        <div className={styles.gallery}>
                            {filteredMedia.map((item, index) => (
                                <AnimatedView key={item.id} delay={0.1 + (index * 0.05)}>
                                    <div
                                        className={styles.mediaItem}
                                        onClick={() => {
                                            if (item.type === 'image') {
                                                setLightboxImage(item.id);
                                            } else {
                                                setVideoModal(item.src);
                                            }
                                        }}
                                    >
                                        <Image
                                            src={item.thumbnail || item.src}
                                            alt={item.title}
                                            fill
                                            className={styles.mediaImage}
                                        />
                                        {item.type === 'video' && (
                                            <div className={styles.videoOverlay}>
                                                <div className={styles.playButton}>
                                                    <div className={styles.playIcon}></div>
                                                </div>
                                            </div>
                                        )}
                                        <div className={styles.mediaCaption}>
                                            <div className={styles.captionTitle}>{item.title}</div>
                                            <div className={styles.captionDate}>{item.date}</div>
                                        </div>
                                    </div>
                                </AnimatedView>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <h3>No media found</h3>
                            <p>Try selecting a different filter</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {lightboxImage !== null && (
                <MediaLightbox
                    imageSrc={mediaItems.find(item => item.id === lightboxImage)?.src || ''}
                    imageAlt={mediaItems.find(item => item.id === lightboxImage)?.title || ''}
                    onClose={() => setLightboxImage(null)}
                    onNext={handleNextImage}
                    onPrev={handlePrevImage}
                />
            )}

            {/* Video Modal */}
            {videoModal && (
                <VideoModal
                    videoSrc={videoModal}
                    onClose={() => setVideoModal(null)}
                />
            )}
        </main>
    );
}
