'use client';

import { useState, useEffect } from 'react';
import styles from './media.module.css';
import AnimatedView from '@/components/AnimatedView';
import Image from 'next/image';
import VideoModal from '@/components/VideoModal';
import { getMediaItems, MediaItem } from '@/app/actions/media';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'albums' | 'videos';

export default function MediaPage() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [videoModal, setVideoModal] = useState<string | null>(null);

    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const data = await getMediaItems();
                setMediaItems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMedia();
    }, []);

    const filteredMedia = mediaItems.filter(item => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'albums') return item.type === 'album';
        if (activeFilter === 'videos') return item.type === 'video';
        return true;
    });

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
                            className={`${styles.filterTab} ${activeFilter === 'albums' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('albums')}
                        >
                            Albums
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
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                            <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#EF4444' }} size={32} />
                        </div>
                    ) : filteredMedia.length > 0 ? (
                        <div className={styles.gallery}>
                            {filteredMedia.map((item, index) => (
                                <AnimatedView key={item.id} delay={0.1 + (index * 0.05)}>
                                    <div
                                        className={styles.mediaItem}
                                        onClick={() => {
                                            if (item.type === 'album') {
                                                router.push(`/media/${item.id}`);
                                            } else if (item.type === 'video' && item.videoUrl) {
                                                setVideoModal(item.videoUrl);
                                            }
                                        }}
                                    >
                                        {item.type === 'video' ? (
                                            <video
                                                src={item.videoUrl}
                                                className={styles.mediaImage}
                                                muted
                                                playsInline
                                                preload="metadata"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Image
                                                src={item.cover}
                                                alt={item.title}
                                                fill
                                                className={styles.mediaImage}
                                            />
                                        )}
                                        {item.type === 'video' && (
                                            <div className={styles.videoOverlay}>
                                                <div className={styles.playButton}>
                                                    <div className={styles.playIcon}></div>
                                                </div>
                                            </div>
                                        )}
                                        <div className={styles.mediaCaption}>
                                            <div className={styles.captionTitle}>{item.title}</div>
                                            <div className={styles.captionDate}>{item.type === 'album' ? `${item.date} • ${item.count} items` : item.date}</div>
                                        </div>
                                    </div>
                                </AnimatedView>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <h3>No media found</h3>
                            <p>Check back later for updates</p>
                        </div>
                    )}
                </div>
            </section>

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
