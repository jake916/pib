"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import styles from '../media.module.css';
import Image from 'next/image';
import MediaLightbox from '@/components/MediaLightbox';
import { getAlbum, Album, Photo } from '@/app/actions/media';
import { toast } from 'sonner';

export default function PublicAlbumDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [album, setAlbum] = useState<Album | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                setIsLoading(true);
                const data = await getAlbum(id as string);
                setAlbum({
                    id: data.id,
                    title: data.title,
                    cover_url: data.cover_url,
                    created_at: data.created_at
                });
                setPhotos(data.photos || []);

                // Automatically open lightbox to first image if photos exist
                if (data.photos && data.photos.length > 0) {
                    setLightboxImage(data.photos[0].id);
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch album details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchAlbumDetails();
        }
    }, [id]);

    const handleNextImage = () => {
        if (!lightboxImage) return;
        const currentIndex = photos.findIndex(item => item.id === lightboxImage);
        const nextIndex = (currentIndex + 1) % photos.length;
        setLightboxImage(photos[nextIndex].id);
    };

    const handlePrevImage = () => {
        if (!lightboxImage) return;
        const currentIndex = photos.findIndex(item => item.id === lightboxImage);
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
        setLightboxImage(photos[prevIndex].id);
    };

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: '4rem' }}>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B'
                        }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>{album?.title || 'Loading...'}</h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>{photos.length} photos</p>
                    </div>
                </div>

                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <Loader2 className={styles.spinner} size={32} style={{ animation: 'spin 1s linear infinite', color: '#EF4444' }} />
                    </div>
                )}

                {/* Image Grid */}
                {!isLoading && photos.length > 0 && (
                    <div className={styles.gallery}>
                        {photos.map((img) => (
                            <div
                                key={img.id}
                                className={styles.mediaItem}
                                onClick={() => setLightboxImage(img.id)}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.title || 'Photo'}
                                    fill
                                    className={styles.mediaImage}
                                />
                                <div className={styles.videoOverlay} style={{ opacity: 0, transition: 'opacity 0.2s', background: 'rgba(0,0,0,0.2)' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0'}>
                                    {/* subtle hover effect */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && photos.length === 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4rem',
                        color: '#94A3B8',
                        border: '2px dashed #E2E8F0',
                        borderRadius: '16px'
                    }}>
                        <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>No photos yet</h3>
                        <p>This album is currently empty.</p>
                    </div>
                )}

                {/* Lightbox */}
                {lightboxImage !== null && (
                    <MediaLightbox
                        imageSrc={photos.find(item => item.id === lightboxImage)?.url || ''}
                        imageAlt={photos.find(item => item.id === lightboxImage)?.title || 'Photo'}
                        onClose={() => {
                            setLightboxImage(null);
                            router.back();
                        }}
                        onNext={handleNextImage}
                        onPrev={handlePrevImage}
                    />
                )}
            </div>
        </main>
    );
}
