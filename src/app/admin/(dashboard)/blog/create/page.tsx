"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Image as ImageIcon, Send, Settings, Users, Tag } from 'lucide-react';
import { createPost, updatePost, getPostById, getCategories, getAuthors, BlogPost, BlogCategory, BlogAuthor } from '@/app/actions/blog';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

function BlogEditorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form fields
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [authorName, setAuthorName] = useState(''); // Compatibility
    const [categoryName, setCategoryName] = useState(''); // Compatibility
    const [readTime, setReadTime] = useState('');
    const [published, setPublished] = useState(false);

    // Relational fields
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [authors, setAuthors] = useState<BlogAuthor[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedAuthorId, setSelectedAuthorId] = useState('');

    // File upload
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);

    // Scheduling state
    const [showPublishDropdown, setShowPublishDropdown] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch Categories and Authors
                const [cats, auths] = await Promise.all([getCategories(), getAuthors()]);
                setCategories(cats);
                setAuthors(auths);

                if (editId) {
                    const post = await getPostById(editId);
                    if (post) {
                        setTitle(post.title);
                        setSlug(post.slug);
                        setContent(post.content);
                        setExcerpt(post.excerpt || '');
                        setAuthorName(post.author);
                        setCategoryName(post.category);
                        setSelectedAuthorId(post.author_id || '');
                        setSelectedCategoryId(post.category_id || '');
                        setReadTime(post.read_time || '');
                        setPublished(post.published);
                        setCurrentCoverUrl(post.cover_url);
                        if (post.cover_url) {
                            setCoverPreview(post.cover_url);
                        }
                        if (post.published_at) {
                            // Convert UTC to local datetime-local string
                            const date = new Date(post.published_at);
                            const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                            setScheduledDate(localDate.toISOString().slice(0, 16));
                        }
                    } else {
                        toast.error('Post not found');
                        router.push('/admin/blog');
                    }
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to initialize editor');
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [editId, router]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!editId) {
            setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent, publishStatus: boolean = false, publishAt?: string | null) => {
        e.preventDefault();

        // Validation
        const finalCategory = categories.find(c => c.id === selectedCategoryId)?.name || categoryName;
        const finalAuthor = authors.find(a => a.id === selectedAuthorId)?.name || authorName;

        if (!title.trim() || !slug.trim() || !content.trim() || !finalCategory || !finalAuthor) {
            toast.error('Please fill in Title, Slug, Content and select Category & Author');
            return;
        }

        setIsSaving(true);
        try {
            // Determine published_at value
            let finalPublishedAt = publishAt;
            if (finalPublishedAt === undefined) {
                 if (publishStatus) {
                     // If publishing/updating and no explicit time is passed, use the existing scheduledDate if present, else now.
                     finalPublishedAt = scheduledDate ? new Date(scheduledDate).toISOString() : new Date().toISOString();
                 } else {
                     finalPublishedAt = null;
                 }
            }

            const postData: Partial<BlogPost> = {
                title,
                slug,
                content,
                excerpt,
                author: finalAuthor,
                author_id: selectedAuthorId || null,
                category: finalCategory,
                category_id: selectedCategoryId || null,
                read_time: readTime,
                published: publishStatus,
                published_at: finalPublishedAt,
            };

            if (editId) {
                postData.cover_url = currentCoverUrl;
                await updatePost(editId, postData, coverFile);
                toast.success('Post updated');
                router.push('/admin/blog');
            } else {
                await createPost(postData, coverFile || undefined);
                toast.success('Post created');
                router.push('/admin/blog');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
            </div>
        );
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, published)} style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button type="button" onClick={() => router.back()} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.5rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex' }}>
                        <ChevronLeft size={20} color="#64748B" />
                    </button>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{editId ? 'Edit Post' : 'Create Post'}</h1>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {published ? (
                        <>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, false, null)}
                                disabled={isSaving}
                                style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isSaving ? 'not-allowed' : 'pointer', color: '#EF4444' }}
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Unpublish
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={isSaving}
                                style={{ backgroundColor: '#0F172A', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isSaving ? 'not-allowed' : 'pointer' }}
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Update
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, false, null)}
                                disabled={isSaving}
                                style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isSaving ? 'not-allowed' : 'pointer' }}
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Draft
                            </button>
                            
                            <div style={{ position: 'relative' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowPublishDropdown(!showPublishDropdown)}
                                    disabled={isSaving}
                                    style={{ backgroundColor: '#0F172A', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isSaving ? 'not-allowed' : 'pointer' }}
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Publish
                                </button>
                                
                                {showPublishDropdown && (
                                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', zIndex: 50, minWidth: '200px', overflow: 'hidden' }}>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                setShowPublishDropdown(false);
                                                handleSubmit(e, true, new Date().toISOString());
                                            }}
                                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}
                                        >
                                            <div style={{ fontWeight: 600, color: '#0F172A' }}>Publish Now</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Make this post live immediately</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPublishDropdown(false);
                                                setShowScheduleModal(true);
                                            }}
                                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            <div style={{ fontWeight: 600, color: '#0F172A' }}>Schedule for later</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Pick a future date and time</div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Post Title"
                        value={title}
                        onChange={handleTitleChange}
                        style={{ width: '100%', fontSize: '2rem', fontWeight: 700, border: 'none', borderBottom: '2px solid #F1F5F9', outline: 'none', padding: '0.5rem 0' }}
                    />

                    {/* Content */}
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '0.5rem', backgroundColor: 'white' }}>
                        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Article Content (Markdown)</div>
                        <textarea
                            placeholder="Write content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ width: '100%', minHeight: '400px', border: 'none', padding: '1.5rem', outline: 'none', resize: 'vertical', fontSize: '1rem', lineHeight: '1.6' }}
                        />
                    </div>

                    {/* Excerpt */}
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '0.5rem', backgroundColor: 'white' }}>
                        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Excerpt</div>
                        <textarea
                            placeholder="Brief summary..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            style={{ width: '100%', minHeight: '100px', border: 'none', padding: '1rem', outline: 'none', resize: 'none', fontSize: '0.875rem' }}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Image */}
                    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '0.5rem', padding: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Cover Image</h3>
                        <label style={{ display: 'block', width: '100%', aspectRatio: '16/9', border: '2px dashed #E2E8F0', borderRadius: '0.5rem', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                            {coverPreview ? (
                                <Image src={coverPreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                                    <ImageIcon size={24} />
                                    <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Upload Image</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Post Settings */}
                    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '0.5rem', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Settings</h3>
                            <Settings size={16} color="#94A3B8" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>Category</label>
                                    <Link href="/admin/blog/categories" style={{ fontSize: '0.65rem', color: '#0F172A', textDecoration: 'underline' }}>Manage</Link>
                                </div>
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                >
                                    <option value="">Select Category...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>Author</label>
                                    <Link href="/admin/blog/authors" style={{ fontSize: '0.65rem', color: '#0F172A', textDecoration: 'underline' }}>Manage</Link>
                                </div>
                                <select
                                    value={selectedAuthorId}
                                    onChange={(e) => setSelectedAuthorId(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                >
                                    <option value="">Select Author...</option>
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#64748B', marginBottom: '0.25rem' }}>Slug</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#64748B', marginBottom: '0.25rem' }}>Read Time</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 5 min read"
                                    value={readTime}
                                    onChange={(e) => setReadTime(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '400px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Schedule Post</h3>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Select Date & Time</label>
                            <input 
                                type="datetime-local" 
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowScheduleModal(false)}
                                style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', background: 'white', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    if (!scheduledDate) {
                                        toast.error("Please select a valid date and time");
                                        return;
                                    }
                                    setShowScheduleModal(false);
                                    const isoDate = new Date(scheduledDate).toISOString();
                                    handleSubmit(e, true, isoDate);
                                }}
                                style={{ padding: '0.5rem 1rem', background: '#0F172A', color: 'white', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

export default function BlogEditorPage() {
    return (
        <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin inline" /></div>}>
            <BlogEditorForm />
        </Suspense>
    );
}
