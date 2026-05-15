'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from './CategoryModal.module.css';
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    Category 
} from '@/app/actions/projects';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoriesChange: () => void;
    categories: Category[];
}

export default function CategoryModal({ isOpen, onClose, onCategoriesChange, categories }: CategoryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleAdd = async () => {
        if (!newCategoryName.trim()) return;
        setIsAdding(true);
        try {
            await createCategory(newCategoryName.trim());
            setNewCategoryName('');
            await onCategoriesChange();
            toast.success('Category added');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add category');
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingName.trim()) return;
        try {
            await updateCategory(id, editingName.trim());
            setEditingId(null);
            await onCategoriesChange();
            toast.success('Category updated');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will affect projects using this category.')) return;
        try {
            await deleteCategory(id);
            await onCategoriesChange();
            toast.success('Category deleted');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete category');
        }
    };

    const startEditing = (category: Category) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Manage Categories</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.addSection}>
                        <div className={styles.inputGroup}>
                            <input 
                                className={styles.input}
                                placeholder="New category name..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                            <button 
                                className={styles.addBtn}
                                onClick={handleAdd}
                                disabled={isAdding || !newCategoryName.trim()}
                            >
                                {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                Add
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className={styles.empty}>Loading categories...</div>
                    ) : categories.length === 0 ? (
                        <div className={styles.empty}>No categories found</div>
                    ) : (
                        <div className={styles.list}>
                            {categories.map((cat) => (
                                <div key={cat.id} className={styles.item}>
                                    {editingId === cat.id ? (
                                        <input 
                                            className={styles.editInput}
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span className={styles.categoryName}>{cat.name}</span>
                                    )}

                                    <div className={styles.itemActions}>
                                        {editingId === cat.id ? (
                                            <>
                                                <button 
                                                    className={`${styles.iconBtn} ${styles.saveBtn}`}
                                                    onClick={() => handleUpdate(cat.id)}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button 
                                                    className={styles.iconBtn}
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    className={styles.iconBtn}
                                                    onClick={() => startEditing(cat)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
