"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    Edit2, 
    Trash2, 
    Calendar, 
    MapPin, 
    Tag, 
    Loader2, 
    ShieldCheck,
    ExternalLink,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import styles from '../projects.module.css';
import { 
    getProject, 
    updateProject, 
    deleteProject, 
    getCategories,
    Project,
    Category
} from '@/app/actions/projects';

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [project, setProject] = useState<Project | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Edit Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [projectData, categoriesData] = await Promise.all([
                getProject(id as string),
                getCategories()
            ]);
            
            if (!projectData) {
                toast.error('Project not found');
                router.push('/admin/projects');
                return;
            }
            
            setProject(projectData);
            setCategories(categoriesData);
        } catch (error: any) {
            console.error('Data load error:', error);
            toast.error('Failed to load project details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!project) return;
        if (!confirm('Are you incredibly sure you want to delete this project? This cannot be undone.')) return;
        
        try {
            setIsSubmitting(true);
            await deleteProject(project.id);
            toast.success('Project deleted successfully');
            router.push('/admin/projects');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project) return;
        const formData = new FormData(e.currentTarget);
        
        try {
            setIsSubmitting(true);
            if (project.images) {
                formData.append('existingImages', JSON.stringify(project.images));
            }
            await updateProject(project.id, formData);
            toast.success('Project updated successfully');
            setIsEditModalOpen(false);
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update project');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#D72638' }} />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                        onClick={() => router.push('/admin/projects')}
                        className={styles.actionBtn}
                        title="Back to Projects"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className={styles.title}>{project.title}</h1>
                        <p className={styles.subtitle}>ID: {project.id}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        className={styles.addBtn} 
                        onClick={() => setIsEditModalOpen(true)}
                        style={{ backgroundColor: '#F8FAFC', color: '#1E293B', border: '1px solid #E2E8F0' }}
                    >
                        <Edit2 size={18} />
                        Edit Project
                    </button>
                    <button 
                        className={styles.addBtn} 
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={18} />}
                        Delete Project
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Left Column: Details & Images */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Main Image */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '1rem', overflow: 'hidden', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                        {project.images && project.images.length > 0 ? (
                            <img 
                                src={project.images[0]} 
                                alt={project.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                                No images available
                            </div>
                        )}
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                             <span className={`${styles.badge} ${
                                project.status === 'Ongoing' ? styles.badgeOngoing : 
                                project.status === 'Completed' ? styles.badgeCompleted : 
                                styles.badgePlanned
                            }`} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                {project.status}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', marginBottom: '1rem' }}>About Project</h2>
                        <p style={{ color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {project.description}
                        </p>
                    </div>

                    {/* Image Gallery */}
                    {project.images && project.images.length > 1 && (
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1E293B', marginBottom: '1.5rem' }}>Project Gallery</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                {project.images.slice(1).map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                                        <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Meta & Access */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Meta Info */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1E293B', marginBottom: '1.5rem' }}>Project Info</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <MapPin size={20} color="#64748B" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>Location (LGA)</div>
                                    <div style={{ fontWeight: 500 }}>{project.lga}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <Tag size={20} color="#64748B" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>Category</div>
                                    <div style={{ fontWeight: 500 }}>{project.category}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <Calendar size={20} color="#64748B" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>Commencement Date</div>
                                    <div style={{ fontWeight: 500 }}>{new Date(project.start_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                </div>
                            </div>

                            {project.completion_date && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                    <Calendar size={20} color="#16A34A" />
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                                            Estimated Completion ({project.show_completion_date ? 'Publicly Visible' : 'Hidden from Public/Gov'})
                                        </div>
                                        <div style={{ fontWeight: 500 }}>{new Date(project.completion_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Government Access Section */}
                    <div style={{ backgroundColor: '#F8FAFC', padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <ShieldCheck size={24} color="#0F172A" />
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1E293B', margin: 0 }}>Gov. Admin Access</h2>
                        </div>

                        {project.is_accessible_to_gov ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ backgroundColor: '#F0FDF4', color: '#166534', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%' }}></div>
                                    Accessible to Government Admins
                                </div>
                                
                                {project.smartsheet_link ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Connected SmartSheet Link</div>
                                        <a 
                                            href={project.smartsheet_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '0.5rem', color: '#2563EB', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        >
                                            <ExternalLink size={16} />
                                            Open SmartSheet
                                        </a>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.875rem', color: '#64748B', fontStyle: 'italic' }}>
                                        No link provided yet. Edit project to add one.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    This project is currently hidden from Government Admins.
                                </p>
                                <button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    style={{ color: '#D72638', background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Enable Access Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal (Copied and modified from main page) */}
            {isEditModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Edit Project</h2>
                            <button className={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Project Title</label>
                                    <input 
                                        name="title" 
                                        className={styles.input} 
                                        defaultValue={project.title} 
                                        required 
                                    />
                                </div>
                                
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>LGA</label>
                                        <select name="lga" className={styles.select} defaultValue={project.lga} required>
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
                                        <select name="category" className={styles.select} defaultValue={project.category} required>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                     </div>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Status</label>
                                        <select name="status" className={styles.select} defaultValue={project.status} required>
                                            <option value="Planned">Planned</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Project Images (Max 7)</label>
                                        <input type="file" name="images" className={styles.input} accept="image/*" multiple />
                                    </div>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Start Date</label>
                                        <input 
                                            type="date" 
                                            name="startDate" 
                                            className={styles.input} 
                                            defaultValue={project.start_date} 
                                            required 
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Completion Date</label>
                                        <input 
                                            type="date" 
                                            name="completionDate" 
                                            className={styles.input} 
                                            defaultValue={project.completion_date || ''} 
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <input 
                                                type="checkbox" 
                                                name="showCompletionDate" 
                                                id="showCompletionDate_edit"
                                                value="true"
                                                defaultChecked={project.show_completion_date}
                                                style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                                            />
                                            <label htmlFor="showCompletionDate_edit" style={{ fontSize: '0.8rem', color: '#64748B', cursor: 'pointer', fontWeight: 500 }}>
                                                Make completion date visible to public and gov admins
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Description</label>
                                    <textarea 
                                        name="description" 
                                        className={styles.textarea} 
                                        defaultValue={project.description} 
                                        required 
                                    />
                                </div>

                                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '1rem' }}>Government Admin Access</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <input 
                                            type="checkbox" 
                                            name="isAccessibleToGov" 
                                            id="isAccessibleToGov_edit"
                                            value="true"
                                            defaultChecked={project.is_accessible_to_gov}
                                            style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                        />
                                        <label htmlFor="isAccessibleToGov_edit" style={{ fontSize: '0.875rem', color: '#475569', cursor: 'pointer' }}>
                                            Make this project accessible to government admins
                                        </label>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>SmartSheet Link</label>
                                        <input 
                                            name="smartsheetLink" 
                                            className={styles.input} 
                                            defaultValue={project.smartsheet_link || ''} 
                                            placeholder="Paste the SmartSheet link here..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Update Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
