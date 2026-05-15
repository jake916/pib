'use client';

import { useEffect, useState } from 'react';
import { getFeedbackById } from '@/app/actions/feedback';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './feedback-detail.module.css';
import { MapPin, User, Mail, Phone, Calendar, Hash, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface Feedback {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    project: string;
    projectName: string;
    subject: string;
    message: string;
    image_url?: string | null;
    submittedAt: string;
    status: 'pending' | 'replied';
    response: string | null;
    respondedAt: string | null;
}

export default function FeedbackDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const feedbackId = params.id as string;
                const data = await getFeedbackById(feedbackId);
                
                const mappedData = {
                    ...data,
                    projectName: data.project_name,
                    submittedAt: data.created_at,
                    respondedAt: data.responded_at
                };
                
                setFeedback(mappedData as unknown as Feedback);
            } catch (error) {
                console.error(error);
                setFeedback(null);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [params.id]);

    const getStatusBadge = (status: string) => {
        const badges = {
            'pending': { label: 'Pending Review', color: '#F59E0B' },
            'replied': { label: 'Response Received', color: '#10B981' }
        };

        const badge = badges[status as keyof typeof badges] || badges.pending;

        return (
            <span className={styles.statusBadge} style={{ backgroundColor: badge.color }}>
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Reference ID copied to clipboard!');
    };

    if (loading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.loading}>Loading feedback details...</div>
                </div>
            </main>
        );
    }

    if (!feedback) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.notFound}>
                        <h1>Feedback Not Found</h1>
                        <p>The feedback you're looking for doesn't exist or has been removed.</p>
                        <Link href="/reports" className="btn btn-primary">
                            Back to Reports
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const backUrl = `/reports?q=${encodeURIComponent(feedback.email)}`;

    return (
        <main className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Feedback Details</h1>
                    <p className={styles.heroSubtitle}>
                        Track the progress of your report and view the official response from the Bureau.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.contentSection}>
                <div className="container">
                    {/* Back Button */}
                    <Link href={backUrl} className={styles.backButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Search Results
                    </Link>

                    {/* Feedback Detail Card */}
                    <div className={styles.feedbackCard}>
                        {/* Header */}
                        <div className={styles.cardHeader}>
                            <div className={styles.headerLeft}>
                                <h1 className={styles.subject}>{feedback.subject}</h1>
                                <div className={styles.meta}>
                                    <Calendar size={14} />
                                    <span>Submitted on {formatDate(feedback.submittedAt)}</span>
                                </div>
                            </div>
                            {getStatusBadge(feedback.status)}
                        </div>

                        {/* Reference ID */}
                        <div className={styles.refIdSection}>
                            <div className={styles.refId}>
                                <Hash size={14} />
                                <span>Reference ID: {feedback.id}</span>
                                <button
                                    onClick={() => copyToClipboard(feedback.id)}
                                    className={styles.copyButton}
                                    title="Copy Reference ID"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <label><MapPin size={14} /> Project</label>
                                <p>{feedback.projectName}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label><User size={14} /> Submitted By</label>
                                <p>{feedback.name}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label><MapPin size={14} /> Location</label>
                                <p>{feedback.location}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label><Mail size={14} /> Email</label>
                                <p>{feedback.email}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label><Phone size={14} /> Phone</label>
                                <p>{feedback.phone}</p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className={styles.messageSection}>
                            <label><MessageSquare size={14} /> Your Message</label>
                            <div className={styles.messageBox}>
                                {feedback.message}
                            </div>
                        </div>

                        {/* Image Evidence */}
                        {feedback.image_url && (
                            <div className={styles.imageEvidenceSection}>
                                <label><ImageIcon size={14} /> Image Evidence</label>
                                <div className={styles.evidenceImageWrapper}>
                                    <img 
                                        src={feedback.image_url} 
                                        alt="Evidence for report" 
                                        className={styles.evidenceImage}
                                    />
                                    <a 
                                        href={feedback.image_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={styles.viewFullLink}
                                    >
                                        View Full Image
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Admin Response */}
                        {feedback.response && (
                            <div className={styles.responseSection}>
                                <div className={styles.responseHeader}>
                                    <div className={styles.pibLogo}>PIB</div>
                                    <h3>Bureau Response</h3>
                                </div>
                                <div className={styles.responseBox}>
                                    <p>{feedback.response}</p>
                                    <div className={styles.responseMeta}>
                                        <Calendar size={12} />
                                        <span>Responded on: {formatDate(feedback.respondedAt!)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Response Yet */}
                        {!feedback.response && feedback.status === 'pending' && (
                            <div className={styles.pendingNotice}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <p>Your feedback is currently under review by our team. We will provide a response as soon as possible.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
