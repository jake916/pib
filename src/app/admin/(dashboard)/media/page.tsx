"use client";

import { useState, useRef, useEffect } from 'react';
import {
    Plus,
    Image as ImageIcon,
    Video,
    MoreVertical,
    Folder,
    Film,
    X,
    UploadCloud,
    Edit2,
    Trash2,
    CheckSquare,
    Loader2
} from 'lucide-react';
import styles from './media.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { getMediaItems, createAlbum, uploadVideo, deleteMediaItem, MediaItem } from '@/app/actions/media';
import { toast } from 'sonner';



export default function MediaPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'albums' | 'videos'>('all');
    const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
    const [isUploadVideoOpen, setIsUploadVideoOpen] = useState(false);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    // Interaction State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    // Modal State
    const [editItem, setEditItem] = useState<MediaItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

    // File Upload Refs
    const albumCoverInputRef = useRef<HTMLInputElement>(null);
    const videoFileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // File Preview State
    const [albumCoverPreview, setAlbumCoverPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    // Data State
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch initial data
    const fetchMedia = async () => {
        try {
            setIsLoading(true);
            const items = await getMediaItems();
            setMediaItems(items);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch media');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);


    const filteredItems = activeTab === 'all'
        ? mediaItems
        : mediaItems.filter(item => item.type === activeTab.slice(0, -1));

    const albumCount = mediaItems.filter(i => i.type === 'album').length;
    const videoCount = mediaItems.filter(i => i.type === 'video').length;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        if (activeMenuId) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [activeMenuId]);

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleMenuAction = (e: React.MouseEvent, action: 'select' | 'edit' | 'delete', item: MediaItem) => {
        e.stopPropagation();
        setActiveMenuId(null);

        if (action === 'select') {
            setSelectionMode(true);
            setSelectedItems(new Set([item.id]));
        } else if (action === 'edit') {
            setEditItem(item);
        } else if (action === 'delete') {
            setDeleteItem(item);
        }
    };

    const handleDelete = async () => {
        if (deleteItem) {
            try {
                setIsSubmitting(true);
                await deleteMediaItem(deleteItem.id, deleteItem.type, deleteItem.type === 'album' ? deleteItem.cover : deleteItem.videoUrl);
                toast.success(`${deleteItem.type === 'album' ? 'Album' : 'Video'} deleted successfully`);
                setMediaItems(prev => prev.filter(i => i.id !== deleteItem.id));
                setDeleteItem(null);
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete item');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBulkDelete = async () => {
        try {
            setIsSubmitting(true);
            const itemsToDelete = mediaItems.filter(i => selectedItems.has(i.id));

            for (const item of itemsToDelete) {
                await deleteMediaItem(item.id, item.type, item.type === 'album' ? item.cover : item.videoUrl);
            }

            toast.success(`${itemsToDelete.length} items deleted successfully`);
            setMediaItems(prev => prev.filter(i => !selectedItems.has(i.id)));
            setSelectedItems(new Set());
            setSelectionMode(false);
            setIsBulkDeleteOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete items');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCardClick = (e: React.MouseEvent, item: MediaItem) => {
        if (selectionMode) {
            e.preventDefault();
            toggleSelection(item.id);
        } else if (item.type === 'video') {
            e.preventDefault();
            setSelectedVideo(item);
        }
        // Albums let Link handle navigation
    };

    const triggerFileUpload = (ref: React.RefObject<HTMLInputElement | null>) => {
        ref.current?.click();
    };

    const handleCreateAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            setIsSubmitting(true);
            await createAlbum(formData);
            toast.success('Album created successfully!');
            setIsCreateAlbumOpen(false);
            setAlbumCoverPreview(null);
            fetchMedia(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || 'Failed to create album');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAlbumCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAlbumCoverPreview(url);
        } else {
            setAlbumCoverPreview(null);
        }
    };

    const handleUploadVideo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            setIsSubmitting(true);
            toast.info('Uploading video, this might take a moment...');
            await uploadVideo(formData);
            toast.success('Video uploaded successfully!');
            setIsUploadVideoOpen(false);
            setVideoPreview(null);
            fetchMedia(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload video');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        } else {
            setVideoPreview(null);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Media Library</h1>
                    <p className={styles.subtitle}>{albumCount} Albums, {videoCount} Videos</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.filterTabs}>
                        <button
                            className={`${styles.filterTab} ${activeTab === 'all' ? styles.active : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeTab === 'albums' ? styles.active : ''}`}
                            onClick={() => setActiveTab('albums')}
                        >
                            Albums
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeTab === 'videos' ? styles.active : ''}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            Videos
                        </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            className={styles.addButton}
                            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                        >
                            <Plus size={18} />
                            Add New
                        </button>
                        {isAddMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                padding: '0.5rem',
                                zIndex: 10,
                                minWidth: '160px',
                                border: '1px solid #E2E8F0'
                            }}>
                                <button
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        width: '100%',
                                        padding: '0.5rem 1rem',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        color: '#1E293B',
                                        fontWeight: 500
                                    }}
                                    onClick={() => {
                                        setIsCreateAlbumOpen(true);
                                        setIsAddMenuOpen(false);
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Folder size={16} /> New Album
                                </button>
                                <button
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        width: '100%',
                                        padding: '0.5rem 1rem',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        color: '#1E293B',
                                        fontWeight: 500
                                    }}
                                    onClick={() => {
                                        setIsUploadVideoOpen(true);
                                        setIsAddMenuOpen(false);
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Video size={16} /> Upload Video
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <Loader2 className={styles.spinner} size={32} />
                </div>
            )}

            {!isLoading && filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
                    <Folder size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3>No media found</h3>
                    <p>Get started by creating an album or uploading a video.</p>
                </div>
            )}

            {/* Media Grid */}
            {!isLoading && filteredItems.length > 0 && (
                <div className={styles.grid}>
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.mediaCard} ${selectedItems.has(item.id) ? styles.selected : ''}`}
                            onClick={(e) => handleCardClick(e, item)}
                        >
                            {item.type === 'video' ? (
                                <video
                                    src={item.videoUrl}
                                    className={styles.cardImage}
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
                                    className={styles.cardImage}
                                />
                            )}
                            <div className={styles.cardOverlay}>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <div className={styles.cardMeta}>
                                    {item.type === 'album' ? (
                                        <>
                                            <span>{item.date}</span>
                                            <span>•</span>
                                            <span>{item.count} items</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Video</span>
                                            <span>•</span>
                                            <span>{item.date}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.cardTypeBadge}>
                                {item.type === 'album' ? <Folder size={12} /> : <Film size={12} />}
                                {item.type === 'album' ? 'Album' : 'Video'}
                            </div>

                            {(selectionMode || selectedItems.has(item.id)) && (
                                <div
                                    className={`${styles.selectionCheckbox} ${selectedItems.has(item.id) ? styles.checked : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(item.id);
                                    }}
                                >
                                    {selectedItems.has(item.id) && <CheckSquare size={16} />}
                                </div>
                            )}

                            {!selectionMode && (
                                <button
                                    className={`${styles.actionsMenuTrigger} ${activeMenuId === item.id ? styles.active : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                                    }}
                                >
                                    <MoreVertical size={16} />
                                </button>
                            )}

                            {activeMenuId === item.id && (
                                <div className={styles.contextMenu} onClick={e => e.stopPropagation()}>
                                    <button className={styles.contextMenuItem} onClick={(e) => handleMenuAction(e, 'select', item)}>
                                        <CheckSquare size={14} /> Select
                                    </button>
                                    <button className={styles.contextMenuItem} onClick={(e) => handleMenuAction(e, 'edit', item)}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button className={`${styles.contextMenuItem} ${styles.delete}`} onClick={(e) => handleMenuAction(e, 'delete', item)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}

                            {item.type === 'album' && !selectionMode && (
                                <Link href={`/admin/media/${item.id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectionMode && selectedItems.size > 0 && (
                <div className={styles.bulkActionsBar}>
                    <span>{selectedItems.size} selected</span>
                    <button className={styles.deleteSelectedButton} onClick={() => setIsBulkDeleteOpen(true)}>
                        Delete Selected
                    </button>
                    <button
                        style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: '-1rem' }}
                        onClick={() => {
                            setSelectionMode(false);
                            setSelectedItems(new Set());
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Models */}

            {isCreateAlbumOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsCreateAlbumOpen(false)}>
                    <form className={styles.modal} onClick={e => e.stopPropagation()} onSubmit={handleCreateAlbum}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Create New Album</h2>
                            <button type="button" className={styles.closeButton} onClick={() => setIsCreateAlbumOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Album Name</label>
                            <input name="title" required type="text" className={styles.input} placeholder="e.g., Road Construction Phase 1" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Cover Photo</label>
                            <div className={styles.uploadArea} onClick={() => triggerFileUpload(albumCoverInputRef)} style={{ position: 'relative', overflow: 'hidden' }}>
                                {albumCoverPreview ? (
                                    <Image
                                        src={albumCoverPreview}
                                        alt="Cover preview"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <>
                                        <UploadCloud size={32} style={{ marginBottom: '0.5rem' }} />
                                        <p>Click to upload or drag and drop</p>
                                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </>
                                )}
                                <input name="coverFile" type="file" ref={albumCoverInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAlbumCoverChange} />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.cancelButton} onClick={() => setIsCreateAlbumOpen(false)}>Cancel</button>
                            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                                {isSubmitting ? <Loader2 className={styles.spinner} size={16} /> : 'Create Album'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Upload Video Modal */}
            {isUploadVideoOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsUploadVideoOpen(false)}>
                    <form className={styles.modal} onClick={e => e.stopPropagation()} onSubmit={handleUploadVideo}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Upload Video</h2>
                            <button type="button" className={styles.closeButton} onClick={() => setIsUploadVideoOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Video Title</label>
                            <input name="title" required type="text" className={styles.input} placeholder="e.g., Governor's Speech" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Video File</label>
                            <div className={styles.uploadArea} onClick={() => triggerFileUpload(videoFileInputRef)} style={{ position: 'relative', overflow: 'hidden', padding: videoPreview ? '0' : '2rem' }}>
                                {videoPreview ? (
                                    <video
                                        src={videoPreview}
                                        controls
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block' }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <>
                                        <Video size={32} style={{ marginBottom: '0.5rem' }} />
                                        <p>Click to upload or drag and drop</p>
                                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>MP4, WEBM or OGG (max. 100MB)</p>
                                    </>
                                )}
                                <input name="videoFile" required type="file" ref={videoFileInputRef} style={{ display: 'none' }} accept="video/*" onChange={handleVideoFileChange} />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.cancelButton} onClick={() => setIsUploadVideoOpen(false)}>Cancel</button>
                            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                                {isSubmitting ? <Loader2 className={styles.spinner} size={16} /> : 'Upload Video'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Modal */}
            {editItem && (
                <div className={styles.modalOverlay} onClick={() => setEditItem(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Edit {editItem.type === 'album' ? 'Album' : 'Video'}</h2>
                            <button className={styles.closeButton} onClick={() => setEditItem(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{editItem.type === 'album' ? 'Album Name' : 'Video Title'}</label>
                            <input
                                type="text"
                                className={styles.input}
                                defaultValue={editItem.title}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{editItem.type === 'album' ? 'Cover Photo' : 'Video File'}</label>
                            <div className={styles.uploadArea} onClick={() => triggerFileUpload(editFileInputRef)}>
                                {editItem.type === 'album' ? <ImageIcon size={32} /> : <Video size={32} />}
                                <p style={{ marginTop: '0.5rem' }}>Click to replace {editItem.type === 'album' ? 'photo' : 'video'}</p>
                                <input
                                    type="file"
                                    ref={editFileInputRef}
                                    style={{ display: 'none' }}
                                    accept={editItem.type === 'album' ? "image/*" : "video/*"}
                                />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={() => setEditItem(null)}>Cancel</button>
                            <button className={styles.submitButton}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Player Modal */}
            {selectedVideo && (
                <div className={styles.modalOverlay} onClick={() => setSelectedVideo(null)}>
                    <div
                        className={styles.modal}
                        style={{ maxWidth: '800px', padding: '0', overflow: 'hidden', background: 'black' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                            <video
                                src={selectedVideo.videoUrl}
                                controls
                                autoPlay
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedVideo(null)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem', background: 'white' }}>
                            <h2 className={styles.modalTitle}>{selectedVideo.title}</h2>
                            <p className={styles.subtitle} style={{ marginBottom: 0 }}>{selectedVideo.date}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modals */}
            {deleteItem && (
                <div className={styles.modalOverlay} onClick={() => setDeleteItem(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle} style={{ color: '#EF4444' }}>Delete Media</h2>
                            <button className={styles.closeButton} onClick={() => setDeleteItem(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p className={styles.warningText}>
                            Are you sure you want to delete this media? Media deleted cannot be recovered again.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={() => setDeleteItem(null)} disabled={isSubmitting}>Cancel</button>
                            <button className={styles.submitButton} onClick={handleDelete} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className={styles.spinner} size={16} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isBulkDeleteOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsBulkDeleteOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle} style={{ color: '#EF4444' }}>Delete Selected Media</h2>
                            <button className={styles.closeButton} onClick={() => setIsBulkDeleteOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p className={styles.warningText}>
                            Are you sure you want to delete the selected media? This is a one time process and deleted files cannot be recovered.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={() => setIsBulkDeleteOpen(false)} disabled={isSubmitting}>Cancel</button>
                            <button className={styles.submitButton} onClick={handleBulkDelete} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className={styles.spinner} size={16} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
