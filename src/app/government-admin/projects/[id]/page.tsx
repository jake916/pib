"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    Calendar, 
    MapPin, 
    Tag, 
    Loader2, 
    ShieldCheck,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/app/admin/(dashboard)/projects/projects.module.css';
import { 
    getProject, 
    Project
} from '@/app/actions/projects';

export default function GovernmentProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const projectData = await getProject(id as string);
            
            if (!projectData || !projectData.is_accessible_to_gov) {
                toast.error('Project not found or access denied');
                router.push('/government-admin/dashboard');
                return;
            }
            
            setProject(projectData);
        } catch (error: any) {
            console.error('Data load error:', error);
            toast.error('Failed to load project details');
        } finally {
            setIsLoading(false);
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
            <div className={styles.header} style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                        onClick={() => router.push('/government-admin/dashboard')}
                        className={styles.actionBtn}
                        style={{ border: 'none', backgroundColor: '#F1F5F9', color: '#64748B' }}
                        title="Back to Projects"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className={styles.title}>{project.title}</h1>
                        <p className={styles.subtitle}>Government Oversight View</p>
                    </div>
                </div>
                <div>
                     <span className={`${styles.badge} ${
                        project.status === 'Ongoing' ? styles.badgeOngoing : 
                        project.status === 'Completed' ? styles.badgeCompleted : 
                        styles.badgePlanned
                    }`} style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}>
                        {project.status}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
                {/* Left Column: Details & Images */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* Main Image */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '1.25rem', overflow: 'hidden', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
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
                    </div>

                    {/* Description */}
                    <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.5rem' }}>Project Description</h2>
                        <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.0625rem', whiteSpace: 'pre-wrap' }}>
                            {project.description}
                        </p>
                    </div>

                    {/* Image Gallery */}
                    {project.images && project.images.length > 1 && (
                        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.5rem' }}>Visual Progress</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                {project.images.slice(1).map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                                        <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Meta & SmartSheet */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* Project Snapshot */}
                    <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Project Snapshot</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ padding: '0.625rem', backgroundColor: '#F1F5F9', borderRadius: '0.75rem' }}>
                                    <MapPin size={20} color="#64748B" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.25rem' }}>LOCATION</div>
                                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{project.lga}, Abia State</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ padding: '0.625rem', backgroundColor: '#F1F5F9', borderRadius: '0.75rem' }}>
                                    <Tag size={20} color="#64748B" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.25rem' }}>CATEGORY</div>
                                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{project.category}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ padding: '0.625rem', backgroundColor: '#F1F5F9', borderRadius: '0.75rem' }}>
                                    <Calendar size={20} color="#64748B" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.25rem' }}>COMMENCEMENT</div>
                                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{new Date(project.start_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                </div>
                            </div>

                            {project.completion_date && project.show_completion_date && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ padding: '0.625rem', backgroundColor: '#F0FDF4', borderRadius: '0.75rem' }}>
                                        <Calendar size={20} color="#16A34A" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.25rem' }}>ESTIMATED COMPLETION</div>
                                        <div style={{ fontWeight: 600, color: '#16A34A' }}>{new Date(project.completion_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monitoring Tool */}
                    <div style={{ backgroundColor: '#0F172A', padding: '2.5rem', borderRadius: '1.25rem', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <ShieldCheck size={28} color="#22C55E" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Monitoring Tool</h2>
                        </div>

                        <p style={{ color: '#94A3B8', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                            Access the live tracking sheet for real-time updates, budgetary allocations, and granular progress reports.
                        </p>

                        {project.smartsheet_link ? (
                            <a 
                                href={project.smartsheet_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '0.75rem', 
                                    padding: '1rem', 
                                    backgroundColor: 'white', 
                                    color: '#0F172A', 
                                    borderRadius: '0.75rem', 
                                    textDecoration: 'none', 
                                    fontSize: '1rem', 
                                    fontWeight: 700,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ExternalLink size={20} />
                                Open SmartSheet
                            </a>
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: '0.5rem', 
                                padding: '1rem', 
                                backgroundColor: 'rgba(255,255,255,0.05)', 
                                color: '#64748B', 
                                borderRadius: '0.75rem', 
                                fontSize: '0.9375rem', 
                                fontWeight: 500,
                                border: '1px dashed rgba(255,255,255,0.2)'
                            }}>
                                No SmartSheet Linked
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
