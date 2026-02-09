import styles from './blog.module.css';
import AnimatedView from '@/components/AnimatedView';
import Image from 'next/image';
import Link from 'next/link';
import { blogArticles } from '@/data/blogData';

export default function BlogPage() {
    return (
        <main>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <AnimatedView>
                        <h1 className={styles.heroTitle}>PIB Blog</h1>
                        <p className={styles.heroSubtitle}>
                            Stay updated with the latest news, project updates, and insights from the Project Implementation Bureau
                        </p>
                    </AnimatedView>
                </div>
            </section>

            {/* Blog Grid */}
            <section className={styles.blogSection}>
                <div className="container">
                    <div className={styles.blogGrid}>
                        {blogArticles.map((article, index) => (
                            <AnimatedView key={article.id} delay={0.1 + (index * 0.05)}>
                                <Link href={`/blog/${article.slug}`} className={styles.articleCard}>
                                    <div className={styles.articleImage}>
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className={styles.articleContent}>
                                        <div className={styles.articleMeta}>
                                            <span className={styles.category}>{article.category}</span>
                                            <span className={styles.date}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                                {article.date}
                                            </span>
                                            <span className={styles.readTime}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                {article.readTime}
                                            </span>
                                        </div>
                                        <h2 className={styles.articleTitle}>{article.title}</h2>
                                        <p className={styles.articleExcerpt}>{article.excerpt}</p>
                                        <div className={styles.readMore}>
                                            Read Article
                                            <span className={styles.arrow}>→</span>
                                        </div>
                                    </div>
                                </Link>
                            </AnimatedView>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
