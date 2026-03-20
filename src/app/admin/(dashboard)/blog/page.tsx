"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2, FileText, Globe, Clock, Search, Filter } from 'lucide-react';
import { getPosts, deletePost, BlogPost } from '@/app/actions/blog';
import { toast } from 'sonner';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const data = await getPosts();
            setPosts(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch posts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleDelete = async (id: string, coverUrl: string | null) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        try {
            setIsDeleting(id);
            await deletePost(id, coverUrl);
            toast.success('Post deleted successfully');
            await loadPosts();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete post');
            setIsDeleting(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Derived distinct values for filters
    const uniqueCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
    const uniqueAuthors = Array.from(new Set(posts.map(p => p.author).filter(Boolean)));

    const filteredPosts = posts.filter(post => {
        // Search
        if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        // Status checks
        const isScheduled = post.published && post.published_at && new Date(post.published_at) > new Date();
        const isPublished = post.published && !isScheduled;
        const isDraft = !post.published;

        if (statusFilter === 'published' && !isPublished) return false;
        if (statusFilter === 'scheduled' && !isScheduled) return false;
        if (statusFilter === 'draft' && !isDraft) return false;

        // Category
        if (categoryFilter !== 'all' && post.category !== categoryFilter) return false;

        // Author
        if (authorFilter !== 'all' && post.author !== authorFilter) return false;

        return true;
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>Blog Posts</h1>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Manage your website's blog articles and news updates.</p>
                </div>

                <Link
                    href="/admin/blog/create"
                    style={{
                        backgroundColor: '#0F172A',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                    }}
                >
                    <Plus size={16} />
                    Create Post
                </Link>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
                </div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <FileText size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>No posts found</h3>
                    <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>Get started by creating your first blog article.</p>
                    <Link
                        href="/admin/blog/create"
                        style={{
                            backgroundColor: '#F1F5F9',
                            color: '#0F172A',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            textDecoration: 'none'
                        }}
                    >
                        Create your first post
                    </Link>
                </div>
            ) : (
                <>
                    {/* Filters Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 300px', position: 'relative' }}>
                                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                />
                            </div>
                            
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem', minWidth: '140px' }}
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="draft">Drafts</option>
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem', minWidth: '140px' }}
                            >
                                <option value="all">All Categories</option>
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                value={authorFilter}
                                onChange={(e) => setAuthorFilter(e.target.value)}
                                style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem', minWidth: '140px' }}
                            >
                                <option value="all">All Authors</option>
                                {uniqueAuthors.map(auth => (
                                    <option key={auth} value={auth}>{auth}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Author</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                                <tr key={post.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                                        <div style={{ fontWeight: 500, color: '#1E293B', marginBottom: '0.25rem' }}>{post.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>/{post.slug}</div>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                                        {post.published ? (
                                            post.published_at && new Date(post.published_at) > new Date() ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 500 }}>
                                                    <Clock size={12} />
                                                    Scheduled
                                                </span>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.75rem', fontWeight: 500 }}>
                                                    <Globe size={12} />
                                                    Published
                                                </span>
                                            )
                                        ) : (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>
                                                <FileText size={12} />
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'middle', color: '#475569', fontSize: '0.875rem' }}>
                                        {post.category}
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'middle', color: '#475569', fontSize: '0.875rem' }}>
                                        {formatDate(post.created_at)}
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'middle', color: '#1E293B', fontSize: '0.875rem', fontWeight: 500 }}>
                                        {post.author}
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link
                                                href={`/admin/blog/create?id=${post.id}`}
                                                style={{ padding: '0.5rem', color: '#64748B', transition: 'color 0.2s', borderRadius: '0.375rem', display: 'inline-flex' }}
                                                title="Edit post"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id, post.cover_url)}
                                                disabled={isDeleting === post.id || post.published}
                                                style={{
                                                    padding: '0.5rem',
                                                    color: (isDeleting === post.id || post.published) ? '#CBD5E1' : '#EF4444',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: (isDeleting === post.id || post.published) ? 'not-allowed' : 'pointer',
                                                    borderRadius: '0.375rem',
                                                    display: 'inline-flex'
                                                }}
                                                title={post.published ? "Unpublish this post to delete it" : "Delete post"}
                                            >
                                                {isDeleting === post.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
                                        No posts match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
            )}
        </div>
    );
}
