import React from 'react';
import { getGovAccessibleProjects, Project } from '@/app/actions/projects';
import { createClient } from '@/lib/supabase/server';
import { 
    FolderKanban, 
    MapPin, 
    Calendar, 
    ExternalLink, 
    Link as LinkIcon,
    AlertCircle,
    Eye
} from 'lucide-react';
import styles from '@/app/admin/(dashboard)/projects/projects.module.css';
import Link from 'next/link';

export default async function GovernmentAdminDashboard() {
    const projects = await getGovAccessibleProjects();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const userName = user?.email?.split('@')[0] || 'Admin';

    return (
        <div>
            {/* Welcome Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                    Welcome back, {userName}!
                </h1>
                <p style={{ color: '#64748B', fontSize: '1.125rem' }}>
                    Monitor the progress of government projects shared with your office.
                </p>
            </div>

            {/* Projects List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FolderKanban size={24} color="#D72638" />
                        Accessible Projects ({projects.length})
                    </h2>
                </div>

                {projects.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '5rem 2rem', 
                        backgroundColor: 'white', 
                        borderRadius: '1rem', 
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <AlertCircle size={48} color="#CBD5E1" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No projects found</h3>
                        <p style={{ color: '#64748B' }}>
                            You currently do not have access to any projects. Please contact the system administrator if you believe this is an error.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '1rem', 
            border: '1px solid #E2E8F0', 
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
        }}>
            {/* Image Header */}
            <div style={{ position: 'relative', height: '200px', backgroundColor: '#F1F5F9' }}>
                <img 
                    src={project.images?.[0] || 'https://archive.org/download/placeholder-image/placeholder-image.jpg'} 
                    alt={project.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <span className={`${styles.badge} ${
                        project.status === 'Ongoing' ? styles.badgeOngoing : 
                        project.status === 'Completed' ? styles.badgeCompleted : 
                        styles.badgePlanned
                    }`} style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {project.status}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D72638', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {project.category}
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.5rem' }}>
                        {project.title}
                    </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.875rem' }}>
                        <MapPin size={16} />
                        {project.lga}, Abia State
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.875rem' }}>
                        <Calendar size={16} />
                        Started: {new Date(project.start_date).toLocaleDateString()}
                    </div>
                </div>

                <p style={{ 
                    color: '#475569', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.5', 
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {project.description}
                </p>

                {/* Actions */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                    <Link 
                        href={`/government-admin/projects/${project.id}`}
                        style={{ 
                            flex: 1,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '0.5rem', 
                            padding: '0.75rem', 
                            backgroundColor: '#F1F5F9', 
                            color: '#1E293B', 
                            borderRadius: '0.5rem', 
                            textDecoration: 'none', 
                            fontSize: '0.875rem', 
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        <Eye size={18} />
                        View Details
                    </Link>

                    {project.smartsheet_link && (
                        <a 
                            href={project.smartsheet_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: '0.5rem', 
                                padding: '0.75rem', 
                                backgroundColor: '#0F172A', 
                                color: 'white', 
                                borderRadius: '0.5rem', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem', 
                                fontWeight: 600,
                                transition: 'background-color 0.2s'
                            }}
                            title="Open SmartSheet"
                        >
                            <ExternalLink size={18} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
