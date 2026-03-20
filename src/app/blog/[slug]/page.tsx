import { notFound } from 'next/navigation';
import styles from './article.module.css';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '@/app/actions/blog';

// In App Router, we export generateMetadata dynamically if desired, 
// but for staticParams we'd need to fetch all slugs from Supabase.
// Omitting generateStaticParams to let it be fully dynamic via SSR.

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getPostBySlug(slug);

    if (!article || !article.published) {
        notFound();
    }

    return (
        <main>
            {/* Article Hero */}
            <section className={styles.articleHero}>
                <Image
                    src={article.cover_url || '/placeholder-blog.jpg'}
                    alt={article.title}
                    fill
                    priority
                    className={styles.heroImage}
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.heroOverlay}></div>
                <div className="container">
                    <div className={styles.heroContent}>
                        <span className={styles.category}>{article.category}</span>
                        <h1 className={styles.articleTitle}>{article.title}</h1>
                        <div className={styles.articleMeta}>
                            <div className={styles.metaItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                {article.author}
                            </div>
                            <div className={styles.metaItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {new Date(article.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            {article.read_time && (
                                <div className={styles.metaItem}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {article.read_time}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className={styles.articleSection}>
                <div className="container">
                    <div className={styles.articleContainer}>
                        <Link href="/blog" className={styles.backButton}>
                            ← Back to Blog
                        </Link>

                        <div className={styles.articleContent}>
                            <ReactMarkdown>{article.content}</ReactMarkdown>
                        </div>

                        {/* Author Section */}
                        <div className={styles.authorSection}>
                            <div className={styles.authorInfo}>
                                <div className={styles.authorAvatar}>
                                    {article.author.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.authorDetails}>
                                    <h3>{article.author}</h3>
                                    <p>Project Implementation Bureau</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
