'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './feedback-detail.module.css';

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
        const feedbackId = params.id as string;

        // Get all feedback from localStorage
        const allFeedback: Feedback[] = JSON.parse(localStorage.getItem('pib_feedback_submissions') || '[]');

        // Find the specific feedback
        const foundFeedback = allFeedback.find(f => f.id === feedbackId);

        setFeedback(foundFeedback || null);
        setLoading(false);
    }, [params.id]);

    const getStatusBadge = (status: string) => {
        const badges = {
            'pending': { label: 'Pending', color: '#F59E0B' },
            'replied': { label: 'Replied', color: '#10B981' }
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
                    <div className={styles.loading}>Loading...</div>
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

    // Construct back URL with search query
    const backUrl = `/reports?q=${encodeURIComponent(feedback.email)}`;

    return (
        <main className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Feedback Details</h1>
                    <p className={styles.heroSubtitle}>
                        View your feedback submission and response from the Project Implementation Bureau
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
                        Back to Feedbacks
                    </Link>

                    {/* Feedback Detail Card */}
                    <div className={styles.feedbackCard}>
                        {/* Header */}
                        <div className={styles.cardHeader}>
                            <div className={styles.headerLeft}>
                                <h1 className={styles.subject}>{feedback.subject}</h1>
                                <p className={styles.meta}>
                                    Submitted on {formatDate(feedback.submittedAt)}
                                </p>
                            </div>
                            {getStatusBadge(feedback.status)}
                        </div>

                        {/* Reference ID */}
                        <div className={styles.refIdSection}>
                            <div className={styles.refId}>
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
                                <label>Project</label>
                                <p>{feedback.projectName}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Name</label>
                                <p>{feedback.name}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Location</label>
                                <p>{feedback.location}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Email</label>
                                <p>{feedback.email}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Phone</label>
                                <p>{feedback.phone}</p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className={styles.messageSection}>
                            <label>Your Message</label>
                            <div className={styles.messageBox}>
                                {feedback.message}
                            </div>
                        </div>

                        {/* Admin Response */}
                        {feedback.response && (
                            <div className={styles.responseSection}>
                                <h3>PIB Response</h3>
                                <div className={styles.responseBox}>
                                    <p>{feedback.response}</p>
                                    <small>Responded on: {formatDate(feedback.respondedAt!)}</small>
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
                                <p>Your feedback is being reviewed. You will receive a response soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
