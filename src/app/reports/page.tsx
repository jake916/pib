'use client';

import { useState, useEffect, Suspense } from 'react';
import styles from './reports.module.css';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

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

type FilterTab = 'all' | 'pending' | 'replied';

function ReportsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

    // Auto-search if query param exists
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchValue(query);
            performSearch(query);
        }
    }, [searchParams]);

    const performSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) return;

        // Get all feedback from localStorage
        const allFeedback: Feedback[] = JSON.parse(localStorage.getItem('pib_feedback_submissions') || '[]');

        // Detect if input is email or phone
        const isEmail = searchTerm.includes('@');
        const term = searchTerm.toLowerCase().trim();

        // Filter feedback
        const results = allFeedback.filter(feedback => {
            if (isEmail) {
                return feedback.email.toLowerCase() === term;
            } else {
                // Remove all non-digits for phone comparison
                const inputPhone = term.replace(/\D/g, '');
                const feedbackPhone = feedback.phone.replace(/\D/g, '');
                return feedbackPhone === inputPhone;
            }
        });

        setFeedbackList(results);
        setHasSearched(true);
        setActiveFilter('all');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchValue.trim()) return;

        // Update URL with search query
        router.push(`/reports?q=${encodeURIComponent(searchValue)}`);
        performSearch(searchValue);
    };

    const getFilteredFeedback = () => {
        if (activeFilter === 'all') return feedbackList;
        return feedbackList.filter(f => f.status === activeFilter);
    };

    const filteredFeedback = getFilteredFeedback();

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
            month: 'short',
            day: 'numeric'
        });
    };

    const pendingCount = feedbackList.filter(f => f.status === 'pending').length;
    const repliedCount = feedbackList.filter(f => f.status === 'replied').length;

    return (
        <>
            {/* Search Section */}
            <section className={styles.searchSection}>
                <div className="container">
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchInputGroup}>
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Enter your email or phone number"
                                className={styles.searchInput}
                                required
                            />
                            <button type="submit" className="btn btn-primary">
                                Search Feedback
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>
                        </div>
                        <p className={styles.searchHint}>
                            💡 Use the same email or phone number you provided when submitting feedback
                        </p>
                    </form>

                    {/* Results */}
                    {hasSearched && (
                        <div className={styles.results}>
                            {feedbackList.length > 0 ? (
                                <>
                                    <div className={styles.resultsHeader}>
                                        <h2>Your Feedback ({feedbackList.length})</h2>

                                        {/* Filter Tabs */}
                                        <div className={styles.filterTabs}>
                                            <button
                                                className={`${styles.filterTab} ${activeFilter === 'all' ? styles.filterTabActive : ''}`}
                                                onClick={() => setActiveFilter('all')}
                                            >
                                                All ({feedbackList.length})
                                            </button>
                                            <button
                                                className={`${styles.filterTab} ${activeFilter === 'pending' ? styles.filterTabActive : ''}`}
                                                onClick={() => setActiveFilter('pending')}
                                            >
                                                Pending ({pendingCount})
                                            </button>
                                            <button
                                                className={`${styles.filterTab} ${activeFilter === 'replied' ? styles.filterTabActive : ''}`}
                                                onClick={() => setActiveFilter('replied')}
                                            >
                                                Replied ({repliedCount})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Grid Layout */}
                                    <div className={styles.feedbackGrid}>
                                        {filteredFeedback.map((feedback) => (
                                            <Link
                                                key={feedback.id}
                                                href={`/reports/${feedback.id}`}
                                                className={styles.feedbackCard}
                                            >
                                                <div className={styles.cardHeader}>
                                                    {getStatusBadge(feedback.status)}
                                                </div>

                                                <div className={styles.cardBody}>
                                                    <h3 className={styles.cardTitle}>{feedback.subject}</h3>
                                                    <p className={styles.cardProject}>{feedback.projectName}</p>
                                                    <p className={styles.cardDate}>{formatDate(feedback.submittedAt)}</p>

                                                    <div className={styles.cardFooter}>
                                                        <span className={styles.viewDetails}>
                                                            View Details
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                <polyline points="12 5 19 12 12 19"></polyline>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {filteredFeedback.length === 0 && (
                                        <div className={styles.emptyState}>
                                            <p>No {activeFilter} feedback found.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.emptyState}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 8v4"></path>
                                        <path d="M12 16h.01"></path>
                                    </svg>
                                    <h3>No Feedback Found</h3>
                                    <p>We couldn't find any feedback associated with this email or phone number.</p>
                                    <p>Please check your input and try again, or submit new feedback.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default function ReportsPage() {
    return (
        <main className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Track Your Feedback</h1>
                    <p className={styles.heroSubtitle}>
                        Enter your email or phone number to view all your submitted feedback and reports
                    </p>
                </div>
            </section>

            <Suspense fallback={<div className="container"><p>Loading search...</p></div>}>
                <ReportsContent />
            </Suspense>
        </main>
    );
}
