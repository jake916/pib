"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    MoreVertical,
    Image as ImageIcon,
    X,
    UploadCloud,
    Trash2,
    Star,
    Loader2
} from 'lucide-react';
import styles from '../media.module.css';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { getAlbum, uploadPhotosToAlbum, deleteMediaItem, togglePhotoFeatured, Album, Photo } from '@/app/actions/media';
import { toast } from 'sonner';



export default function AlbumDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [isAddImageOpen, setIsAddImageOpen] = useState(false);
    const [album, setAlbum] = useState<Album | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

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
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch album details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbumDetails();
    }, [id]);

    const handleUploadPhotos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            setIsSubmitting(true);
            toast.info('Uploading photos, please wait...');
            await uploadPhotosToAlbum(id as string, formData);
            toast.success('Photos uploaded successfully!');
            setIsAddImageOpen(false);
            setPhotoPreviews([]);
            fetchAlbumDetails(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload photos');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhotoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Cleanup old preview URLs
        photoPreviews.forEach(url => URL.revokeObjectURL(url));

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPhotoPreviews(newPreviews);
    };

    const handleDeletePhoto = async () => {
        if (!deletePhotoId) return;

        try {
            setIsSubmitting(true);
            const photoToDelete = photos.find(p => p.id === deletePhotoId);
            if (photoToDelete) {
                await deleteMediaItem(deletePhotoId, 'photo', photoToDelete.url);
                toast.success('Photo deleted successfully');
                setPhotos(prev => prev.filter(p => p.id !== deletePhotoId));
            }
            setDeletePhotoId(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete photo');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleFeatured = async (photoId: string, currentStatus: boolean) => {
        try {
            await togglePhotoFeatured(photoId, !currentStatus);
            setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, is_featured: !currentStatus } : p));
            toast.success(`Photo ${!currentStatus ? 'marked as featured' : 'removed from featured'}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update featured status');
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                        <h1 className={styles.title}>{album?.title || 'Loading...'}</h1>
                        <p className={styles.subtitle}>{photos.length} photos</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.addButton} onClick={() => setIsAddImageOpen(true)}>
                        <Plus size={18} />
                        Add Photos
                    </button>
                </div>
            </div>

            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <Loader2 className={styles.spinner} size={32} />
                </div>
            )}

            {/* Image Grid */}
            {!isLoading && photos.length > 0 && (
                <div className={styles.grid}>
                    {photos.map((img) => (
                        <div key={img.id} className={styles.mediaCard} style={{ aspectRatio: '1/1' }}>
                            <Image
                                src={img.url}
                                alt={img.title || 'Photo'}
                                fill
                                className={styles.cardImage}
                            />
                            <div className={styles.cardOverlay} style={{ height: 'auto', padding: '1rem' }}>
                                <div className={styles.cardMeta} style={{ color: 'white' }}>
                                    <span>{new Date(img.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Actions Menu */}
                            <div className={styles.actionsMenuTrigger} style={{ display: 'flex', gap: '4px', background: 'transparent', padding: 0, border: 'none' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleFeatured(img.id, img.is_featured);
                                    }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: img.is_featured ? '#EAB308' : '#94A3B8'
                                    }}
                                    title={img.is_featured ? "Unfeature" : "Feature"}
                                >
                                    <Star size={16} fill={img.is_featured ? "#EAB308" : "none"} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletePhotoId(img.id);
                                    }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#EF4444'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
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
                    <p>Click "Add Photos" to upload images to this album.</p>
                </div>
            )}

            {/* Add Images Modal */}
            {isAddImageOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAddImageOpen(false)}>
                    <form className={styles.modal} onClick={e => e.stopPropagation()} onSubmit={handleUploadPhotos}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Add Photos to Album</h2>
                            <button type="button" className={styles.closeButton} onClick={() => setIsAddImageOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()} style={{ position: 'relative', overflow: 'hidden' }}>
                                {photoPreviews.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', width: '100%' }}>
                                        {photoPreviews.map((url, idx) => (
                                            <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '4px', overflow: 'hidden' }}>
                                                <Image src={url} alt={`preview ${idx}`} fill style={{ objectFit: 'cover' }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud size={32} style={{ marginBottom: '0.5rem' }} />
                                        <p>Click to upload or drag and drop</p>
                                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>JPG, PNG or WEBP (max. 5MB each)</p>
                                    </>
                                )}
                                <input name="photos" type="file" multiple ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handlePhotoFilesChange} />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.cancelButton} onClick={() => setIsAddImageOpen(false)}>Cancel</button>
                            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                                {isSubmitting ? <Loader2 className={styles.spinner} size={16} /> : 'Upload Photos'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Photo Modal */}
            {deletePhotoId && (
                <div className={styles.modalOverlay} onClick={() => setDeletePhotoId(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle} style={{ color: '#EF4444' }}>Delete Photo</h2>
                            <button className={styles.closeButton} onClick={() => setDeletePhotoId(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p className={styles.warningText}>
                            Are you sure you want to delete this photo? This cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={() => setDeletePhotoId(null)} disabled={isSubmitting}>Cancel</button>
                            <button className={styles.submitButton} onClick={handleDeletePhoto} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className={styles.spinner} size={16} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
