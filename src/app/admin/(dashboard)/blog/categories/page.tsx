"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Trash2, Loader2, Tag } from 'lucide-react';
import { getCategories, createCategory, deleteCategory, BlogCategory } from '@/app/actions/blog';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newName, setNewName] = useState('');

    const loadData = async () => {
        try {
            setIsLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch categories');
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
            const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await createCategory(newName, slug);
            toast.success('Category created');
            setNewName('');
            await loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? Posts using this category will still exist but without a linked category.')) return;
        try {
            await deleteCategory(id);
            toast.success('Category deleted');
            await loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete category');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/admin/blog" style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.5rem', borderRadius: '0.375rem', display: 'flex' }}>
                    <ChevronLeft size={20} color="#64748B" />
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B' }}>Manage Categories</h1>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Category name (e.g. Technology)"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', outline: 'none' }}
                        disabled={isSubmitting}
                    />
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
                            gap: '0.5rem',
                            cursor: (isSubmitting || !newName.trim()) ? 'not-allowed' : 'pointer',
                            opacity: (isSubmitting || !newName.trim()) ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
                        Add Category
                    </button>
                </form>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
                </div>
            ) : categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px dashed #E2E8F0' }}>
                    <Tag size={32} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#64748B' }}>No categories found. Create one above.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    {categories.map((cat) => (
                        <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                            <div>
                                <div style={{ fontWeight: 500, color: '#1E293B' }}>{cat.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{cat.slug}</div>
                            </div>
                            <button
                                onClick={() => handleDelete(cat.id)}
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
