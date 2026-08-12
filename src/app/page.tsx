import styles from "./page.module.css";
import statStyles from "./stats.module.css";
import AnimatedView from "@/components/AnimatedView";
import StatCounter from "@/components/StatCounter";
import Link from "next/link";
import { getRandomPhotos, getFeaturedPhotos } from "./actions/media";
import { getPosts } from "@/app/actions/blog";
import { getProjects } from "@/app/actions/projects";
import HeroSlider from "@/components/HeroSlider";

export default async function Home() {
  const [randomPhotos, featuredPhotos, recentPostsRaw, allProjects] = await Promise.all([
    getRandomPhotos(8).catch(() => []),
    getFeaturedPhotos().catch(() => []),
    getPosts({ publishedOnly: true }).catch(() => []),
    getProjects().catch(() => [])
  ]);

  const displayPosts = recentPostsRaw.slice(0, 3);
  const displayProjects = allProjects.slice(0, 3);

  const defaultMedia: any[] = [
    { id: 'd1', src: '/media-bridge.png', title: 'Infrastructure', type: 'image', date: '' },
    { id: 'd2', src: '/media-solar.png', title: 'Renewable Energy', type: 'image', date: '' },
    { id: 'd3', src: '/media-plaza.png', title: 'Urban Development', type: 'image', date: '' },
    { id: 'd4', src: '/media-water.png', title: 'Water Resources', type: 'image', date: '' },
    { id: 'd5', src: '/media-tech-hub.png', title: 'Technology & Innovation', type: 'image', date: '' },
    { id: 'd6', src: '/media-market.png', title: 'Commerce & Trade', type: 'image', date: '' },
    { id: 'd7', src: '/media-housing.png', title: 'Affordable Housing', type: 'image', date: '' },
    { id: 'd8', src: '/media-bridge.png', title: 'Public Works', type: 'image', date: '' },
  ];

  const displayMedia = [...randomPhotos];
  if (displayMedia.length < 8) {
    displayMedia.push(...defaultMedia.slice(displayMedia.length, 8));
  }
  return (
    <main>
      {/* HERO SECTION */}
      {featuredPhotos.length > 0 ? (
        <HeroSlider photos={featuredPhotos} />
      ) : (
        <section className={styles.hero}>
          <div className="container">
            <AnimatedView className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Delivering public projects with Quality, transparency and accountability.
              </h1>
              <p className={styles.heroSubtitle}>
                The Project Implementation Bureau monitors, coordinates, and reports on government-approved projects across Abia State to ensure effective delivery, quality standards, and public accountability.
              </p>
              <div className={styles.heroActions}>
                <button className="btn btn-primary">
                  View Active Projects
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <Link href="/about" className="btn btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>
                  About the Bureau
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </AnimatedView>
          </div>
        </section>
      )}

      {/* IMPACT TRACKER */}
      <section className={statStyles.impact}>
        <div className="container">
          <AnimatedView className={statStyles.statsGrid}>
            <StatCounter value={300} suffix="+" label="Active Projects" />
            <StatCounter value={17} label="LGAs Covered" />
          </AnimatedView>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className={styles.projects} id="projects">
        <div className="container">
          <AnimatedView className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            <p className={styles.sectionDesc}>
              Track the progress of key infrastructure, healthcare, and educational initiatives across the state.
            </p>
          </AnimatedView>

          <div className={styles.projectGrid}>
            {displayProjects.map((project, index) => (
              <AnimatedView key={project.id} delay={0.1 * (index + 1)} className={styles.projectCard}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.cardTag} ${project.status === 'Ongoing' ? styles.cardTagActive : ''}`}>
                    {project.status}
                  </span>
                  <span className={styles.cardYear}>
                    {new Date(project.start_date).getFullYear()}
                  </span>
                </div>

                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>
                  {project.description}
                </p>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {project.lga}, Abia State
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <Link href={`/projects`} className={styles.trackLink}>
                  View details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>

                <div className={styles.cardImageContainer}>
                  <img src={project.images?.[0] || '/project-placeholder.png'} alt={project.title} />
                </div>
              </AnimatedView>
            ))}
            
            {displayProjects.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748B', padding: '2rem 0' }}>
                No active projects to display at this time.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <a href="#" className={styles.trackLink} style={{ display: 'inline-flex', fontSize: '1rem' }}>
              View Project Dashboard
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </section>

      {/* MANDATE SECTION */}
      <section className={styles.mandate} id="mandate">
        <div className="container">
          <div className={styles.mandateContent}>
            {/* Left: Text */}
            <AnimatedView className={styles.mandateText}>
              <h2 className={styles.mandateTitle}>Our Mandate</h2>
              <p className={styles.mandateDesc}>
                The Project Implementation Bureau is responsible for overseeing the implementation of key government projects across Abia State.
              </p>
              <p className={styles.mandateDesc}>
                The Bureau provides centralized monitoring, coordination, and reporting to ensure that projects are delivered in line with approved scope, timelines, and standards, while improving transparency and accountability in public service delivery.
              </p>
              <Link href="/about" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                Read Detailed Mandate
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </AnimatedView>

            {/* Right: Image */}
            <AnimatedView delay={0.2} className={styles.mandateImage}>
              <img
                src="/UBAKALA SMART SCHOOL conv 7.jpeg"
                alt="Ubakala Smart School"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AnimatedView>
          </div>
        </div>
      </section>

      {/* MEDIA SECTION */}
      <section className={styles.media} id="media">
        <div className="container">
          <AnimatedView className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Project Media Gallery</h2>
            <p className={styles.sectionDesc}>
              Visual documentation of ongoing and completed projects across the state.
            </p>
          </AnimatedView>

          <AnimatedView delay={0.2} className={styles.mediaGrid}>
            {displayMedia.map((item, index) => (
              <div key={item.id || index} className={styles.mediaItem}>
                <img src={item.src} alt={item.title} />
              </div>
            ))}
          </AnimatedView>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <Link href="/media" className={styles.trackLink} style={{ display: 'inline-flex', fontSize: '1rem' }}>
              View more media
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className={styles.blog} id="blog">
        <div className="container">
          <AnimatedView className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest News & Updates</h2>
            <p className={styles.sectionDesc}>
              Stay informed about government policies, project milestones, and community impact stories.
            </p>
          </AnimatedView>

          <AnimatedView delay={0.2} className={styles.blogGrid}>
            {displayPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.blogCard}>
                  <div className={styles.blogImage}>
                    <img src={post.cover_url || '/blog-infrastructure.png'} alt={post.title} />
                  </div>
                  <div className={styles.blogContent}>
                    <span className={styles.blogDate}>
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <h3 className={styles.blogTitle}>{post.title}</h3>
                    <p className={styles.blogExcerpt}>
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>
                    <span className={styles.readMore}>
                      Read Article
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            
            {displayPosts.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748B', padding: '2rem 0' }}>
                No recent news articles at this time.
              </p>
            )}
          </AnimatedView>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <Link href="/blog" className={styles.trackLink} style={{ display: 'inline-flex', fontSize: '1rem' }}>
              Read more news
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
