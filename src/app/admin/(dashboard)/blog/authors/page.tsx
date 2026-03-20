"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Trash2, Loader2, User } from 'lucide-react';
import { getAuthors, createAuthor, deleteAuthor, BlogAuthor } from '@/app/actions/blog';
import { toast } from 'sonner';

export default function AdminAuthorsPage() {
    const [authors, setAuthors] = useState<BlogAuthor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('');

    const loadData = async () => {
        try {
            setIsLoading(true);
            const data = await getAuthors();
            setAuthors(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch authors');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSubmitting(true);
        try {
            await createAuthor({ name: newName, role: newRole });
            toast.success('Author added');
            setNewName('');
            setNewRole('');
            await loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add author');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteAuthor(id);
            toast.success('Author deleted');
            await loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete author');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/admin/blog" style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.5rem', borderRadius: '0.375rem', display: 'flex' }}>
                    <ChevronLeft size={20} color="#64748B" />
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B' }}>Manage Authors</h1>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', outline: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="Role (e.g. Editor)"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', outline: 'none' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !newName.trim()}
                        style={{
                            backgroundColor: '#0F172A',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '0.375rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: (isSubmitting || !newName.trim()) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
                        Add Author
                    </button>
                </form>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
                </div>
            ) : authors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px dashed #E2E8F0' }}>
                    <User size={32} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#64748B' }}>No authors found.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    {authors.map((author) => (
                        <div key={author.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                    <User size={16} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 500, color: '#1E293B' }}>{author.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{author.role || 'Contributor'}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(author.id)}
                                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
