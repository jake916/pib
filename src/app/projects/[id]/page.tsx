import React from 'react';
import { getProject } from '@/app/actions/projects';
import { notFound } from 'next/navigation';
import styles from './project-detail.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Calendar, Tag, CheckCircle2, Clock, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProjectGallery from '@/components/ProjectGallery';
import ProjectFeedbackSidebar from '@/components/ProjectFeedbackSidebar';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    return (
        <div className={styles.page}>
            <Header />
            
            <div className={styles.hero}>
                <div className="container">
                    <Link href="/projects" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Projects
                    </Link>

                    <div className={styles.heroContent}>
                        <div className={styles.categoryBadge}>
                            <Tag size={14} /> {project.category}
                        </div>
                        <h1 className={styles.title}>{project.title}</h1>
                        <div className={styles.meta}>
                            <div className={styles.metaItem}>
                                <MapPin size={16} /> {project.lga}, Abia State
                            </div>
                            <div className={`${styles.statusBadge} ${
                                project.status === 'Ongoing' ? styles.statusOngoing : 
                                project.status === 'Completed' ? styles.statusCompleted : 
                                styles.statusPlanned
                            }`}>
                                {project.status === 'Ongoing' && <Clock size={14} />}
                                {project.status === 'Completed' && <CheckCircle2 size={14} />}
                                {project.status === 'Planned' && <Calendar size={14} />}
                                {project.status}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <ProjectGallery images={project.images} title={project.title} />

                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Project Description</h2>
                                <div className={styles.description}>
                                    {project.description.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className={styles.sidebar}>
                            <div className={styles.statsCard}>
                                <h3 className={styles.cardTitle}>Project Details</h3>
                                
                                <div className={styles.statItem}>
                                    <div className={styles.statLabel}>Start Date</div>
                                    <div className={styles.statValue}>
                                        {new Date(project.start_date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>

                                {project.completion_date && project.show_completion_date && (
                                    <div className={styles.statItem}>
                                        <div className={styles.statLabel}>Expected Completion</div>
                                        <div className={styles.statValue}>
                                            {new Date(project.completion_date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.statItem}>
                                    <div className={styles.statLabel}>Location</div>
                                    <div className={styles.statValue}>{project.lga} LGA</div>
                                </div>

                                <div className={styles.statItem}>
                                    <div className={styles.statLabel}>Sector</div>
                                    <div className={styles.statValue}>{project.category}</div>
                                </div>
                            </div>

                            <ProjectFeedbackSidebar projectId={project.id} />
                        </aside>
                    </div>
                </div>
            </main>

            <Footer showFeedback={false} />
        </div>
    );
}
