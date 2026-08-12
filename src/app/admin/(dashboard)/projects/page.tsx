"use client";

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    X, 
    Loader2, 
    FolderKanban, 
    MapPin, 
    Calendar,
    Filter,
    Tags,
    Eye
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './projects.module.css';
import Link from 'next/link';
import { 
    getProjects, 
    createProject, 
    updateProject, 
    deleteProject, 
    getProject,
    getCategories,
    Project,
    Category
} from '@/app/actions/projects';
import CategoryModal from '@/components/CategoryModal';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [projectsData, categoriesData] = await Promise.all([
                getProjects(),
                getCategories()
            ]);
            setProjects(projectsData);
            setCategories(categoriesData);
        } catch (error: any) {
            console.error('Data load error:', error);
            toast.error('Failed to refresh data');
        } finally {
            setIsLoading(false);
        }
    };


    const handleOpenAddModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    // handleOpenEditModal is removed as editing is now done on the details page

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        
        try {
            await deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            toast.success('Project deleted successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete project');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            setIsSubmitting(true);
            if (editingProject) {
                if (editingProject.images) {
                    formData.append('existingImages', JSON.stringify(editingProject.images));
                }
                await updateProject(editingProject.id, formData);
                toast.success('Project updated successfully');
            } else {
                await createProject(formData);
                toast.success('Project created successfully');
            }
            setIsModalOpen(false);
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lga.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Projects Management</h1>
                    <p className={styles.subtitle}>Create and manage government projects across Abia State</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        className={styles.addBtn} 
                        onClick={() => setIsCategoryModalOpen(true)}
                        style={{ backgroundColor: '#F8FAF6', color: '#1E293B', border: '1px solid #E2E8F0' }}
                    >
                        <Tags size={18} />
                        Categories
                    </button>
                    <button className={styles.addBtn} onClick={handleOpenAddModal}>
                        <Plus size={18} />
                        Add New Project
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search projects by title or LGA..." 
                        className={styles.input}
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#D72638' }} />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className={styles.emptyState}>
                    <FolderKanban size={48} className={styles.emptyIcon} />
                    <h3 className={styles.projectName}>No projects found</h3>
                    <p className={styles.emptyText}>
                        {searchTerm ? 'Try a different search term' : 'Start by adding your first project'}
                    </p>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr key={project.id}>
                                    <td>
                                        <div className={styles.projectCell}>
                                            <img 
                                                src={project.images?.[0] || 'https://archive.org/download/placeholder-image/placeholder-image.jpg'} 
                                                alt="" 
                                                className={styles.projectImage} 
                                            />
                                            <div>
                                                <div className={styles.projectName}>{project.title}</div>
                                                <div className={styles.projectLga}>
                                                    <MapPin size={12} style={{ marginRight: '4px', display: 'inline' }} />
                                                    {project.lga}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{project.category}</td>
                                    <td>
                                        <span className={`${styles.badge} ${
                                            project.status === 'Ongoing' ? styles.badgeOngoing : 
                                            project.status === 'Completed' ? styles.badgeCompleted : 
                                            styles.badgePlanned
                                        }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}>
                                            <Calendar size={14} />
                                            {new Date(project.start_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link 
                                                href={`/admin/projects/${project.id}`}
                                                className={styles.actionBtn}
                                                title="View Project Details"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Project Title</label>
                                    <input 
                                        name="title" 
                                        className={styles.input} 
                                        defaultValue={editingProject?.title} 
                                        required 
                                        placeholder="e.g. Construction of New Hospital"
                                    />
                                </div>
                                
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>LGA</label>
                                        <select name="lga" className={styles.select} defaultValue={editingProject?.lga || ''} required>
                                            <option value="" disabled>Select LGA</option>
                                            <option value="Aba North">Aba North</option>
                                            <option value="Aba South">Aba South</option>
                                            <option value="Arochukwu">Arochukwu</option>
                                            <option value="Bende">Bende</option>
                                            <option value="Ikwuano">Ikwuano</option>
                                            <option value="Isiala Ngwa North">Isiala Ngwa North</option>
                                            <option value="Isiala Ngwa South">Isiala Ngwa South</option>
                                            <option value="Isuikwuato">Isuikwuato</option>
                                            <option value="Obi Ngwa">Obi Ngwa</option>
                                            <option value="Ohafia">Ohafia</option>
                                            <option value="Osisioma Ngwa">Osisioma Ngwa</option>
                                            <option value="Ugwunagbo">Ugwunagbo</option>
                                            <option value="Ukwa East">Ukwa East</option>
                                            <option value="Ukwa West">Ukwa West</option>
                                            <option value="Umu Nneochi">Umu Nneochi</option>
                                            <option value="Umuahia North">Umuahia North</option>
                                            <option value="Umuahia South">Umuahia South</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Category</label>
                                        <select name="category" className={styles.select} defaultValue={editingProject?.category || ''} required>
                                            <option value="" disabled>Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                     </div>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Status</label>
                                        <select name="status" className={styles.select} defaultValue={editingProject?.status || 'Planned'} required>
                                            <option value="Planned">Planned</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Start Date</label>
                                        <input 
                                            type="date" 
                                            name="startDate" 
                                            className={styles.input} 
                                            defaultValue={editingProject?.start_date} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Completion Date (Optional)</label>
                                        <input 
                                            type="date" 
                                            name="completionDate" 
                                            className={styles.input} 
                                            defaultValue={editingProject?.completion_date || ''} 
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <input 
                                                type="checkbox" 
                                                name="showCompletionDate" 
                                                id="showCompletionDate"
                                                value="true"
                                                defaultChecked={editingProject ? editingProject.show_completion_date : true}
                                                style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                                            />
                                            <label htmlFor="showCompletionDate" style={{ fontSize: '0.8rem', color: '#64748B', cursor: 'pointer', fontWeight: 500 }}>
                                                Make completion date visible to public and gov admins
                                            </label>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Project Images (Max 7)</label>
                                        <input type="file" name="images" className={styles.input} accept="image/*" multiple />
                                        {editingProject && editingProject.images && editingProject.images.length > 0 && (
                                            <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#64748B' }}>
                                                {editingProject.images.length} existing images saved.
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <input 
                                                type="checkbox" 
                                                name="addToMedia" 
                                                id="addToMediaModal"
                                                value="true"
                                                defaultChecked={true}
                                                style={{ width: '1rem', height: '1rem', cursor: 'pointer', accentColor: '#D72638' }}
                                            />
                                            <label htmlFor="addToMediaModal" style={{ fontSize: '0.8rem', color: '#64748B', cursor: 'pointer', fontWeight: 500 }}>
                                                Add images to Media Gallery (creates album)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Description</label>
                                    <textarea 
                                        name="description" 
                                        className={styles.textarea} 
                                        defaultValue={editingProject?.description} 
                                        required 
                                        placeholder="Detailed description of the project..."
                                    />
                                </div>

                                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '1rem' }}>Government Admin Access</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <input 
                                            type="checkbox" 
                                            name="isAccessibleToGov" 
                                            id="isAccessibleToGov"
                                            value="true"
                                            defaultChecked={editingProject?.is_accessible_to_gov}
                                            style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                        />
                                        <label htmlFor="isAccessibleToGov" style={{ fontSize: '0.875rem', color: '#475569', cursor: 'pointer' }}>
                                            Make this project accessible to government admins
                                        </label>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>SmartSheet Link</label>
                                        <input 
                                            name="smartsheetLink" 
                                            className={styles.input} 
                                            defaultValue={editingProject?.smartsheet_link || ''} 
                                            placeholder="Paste the SmartSheet link here..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    className={styles.cancelBtn} 
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.submitBtn}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '8px', display: 'inline' }} />
                                            Saving...
                                        </>
                                    ) : (
                                        editingProject ? 'Update Project' : 'Create Project'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Categories Modal */}
            <CategoryModal 
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onCategoriesChange={loadData}
                categories={categories}
            />
        </div>
    );
}
