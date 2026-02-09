import styles from "./page.module.css";
import statStyles from "./stats.module.css";
import AnimatedView from "@/components/AnimatedView";
import StatCounter from "@/components/StatCounter";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className="container">
          <AnimatedView className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Delivering Public Projects With Transparency and Accountability
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

      {/* IMPACT TRACKER */}
      <section className={statStyles.impact}>
        <div className="container">
          <AnimatedView className={statStyles.statsGrid}>
            <StatCounter value={150} suffix="+" label="Active Projects" />
            <StatCounter value={31} label="LGAs Covered" />
            <StatCounter value={2.1} prefix="₦" suffix="B" decimals={1} label="Total Investment" />
            <StatCounter value={89} suffix="%" label="On Track" color="#D72638" />
          </AnimatedView>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className={styles.projects} id="projects">
        <div className="container">
          <AnimatedView className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest Projects</h2>
            <p className={styles.sectionDesc}>
              Track the progress of key infrastructure, healthcare, and educational initiatives across the state.
            </p>
          </AnimatedView>

          <div className={styles.projectGrid}>
            {/* Project Card 1 */}
            <AnimatedView delay={0.1} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <span className={`${styles.cardTag} ${styles.cardTagActive}`}>Active Construction</span>
                <span className={styles.cardYear}>2025</span>
              </div>

              <h3 className={styles.projectTitle}>Aba Smart School Initiative</h3>
              <p className={styles.projectDesc}>
                Comprehensive infrastructure upgrade and renovation project to transform Aba schools into modern centers of excellence with digital learning facilities.
              </p>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Osisioma Ngwa, Abia State
                </div>
                <div className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Dec 8, 2025
                </div>
              </div>

              <a href="#" className={styles.trackLink}>
                Track progress
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>

              <div className={styles.cardImageContainer}>
                <img src="/aba-smart-school.png" alt="Aba Smart School" />
              </div>
            </AnimatedView>

            {/* Project Card 2 */}
            <AnimatedView delay={0.2} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <span className={`${styles.cardTag} ${styles.cardTagActive}`}>Near Completion</span>
                <span className={styles.cardYear}>2024</span>
              </div>

              <h3 className={styles.projectTitle}>Umuahia General Hospital Upgrade</h3>
              <p className={styles.projectDesc}>
                Full-scale renovation of the emergency ward and installation of state-of-the-art diagnostic equipment to improve healthcare delivery.
              </p>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Umuahia North, Abia State
                </div>
                <div className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Nov 15, 2024
                </div>
              </div>

              <a href="#" className={styles.trackLink}>
                Track progress
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>

              <div className={styles.cardImageContainer}>
                <img src="/umuahia-hospital.png" alt="Umuahia General Hospital" />
              </div>
            </AnimatedView>

            {/* Project Card 3 */}
            <AnimatedView delay={0.3} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <span className={`${styles.cardTag} ${styles.cardTagActive}`}>Ongoing</span>
                <span className={styles.cardYear}>2025</span>
              </div>

              <h3 className={styles.projectTitle}>Rural Access Road Network</h3>
              <p className={styles.projectDesc}>
                Construction of 45km of rural access roads to connect agricultural communities to major markets and improve economic activity.
              </p>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Multiple LGAs
                </div>
                <div className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Jan 20, 2025
                </div>
              </div>

              <a href="#" className={styles.trackLink}>
                Track progress
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>

              <div className={styles.cardImageContainer}>
                <img src="/rural-access-road.png" alt="Rural Access Road" />
              </div>
            </AnimatedView>
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
                src="/mandate-inspection.png"
                alt="PIB Officials Inspecting Site"
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
            <div className={styles.mediaItem}>
              <img src="/media-bridge.png" alt="Bridge Construction" />
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaLabel}>Infrastructure</span>
              </div>
            </div>
            <div className={styles.mediaItem}>
              <img src="/media-solar.png" alt="Solar Power Grid" />
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaLabel}>Renewable Energy</span>
              </div>
            </div>
            <div className={styles.mediaItem}>
              <img src="/media-plaza.png" alt="Urban Plaza" />
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaLabel}>Urban Development</span>
              </div>
            </div>
            <div className={styles.mediaItem}>
              <img src="/media-water.png" alt="Water Treatment" />
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaLabel}>Water Resources</span>
              </div>
            </div>
            <div className={styles.mediaItem}>
              <img src="/media-tech-hub.png" alt="Tech Hub" />
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaLabel}>Technology & Innovation</span>
              </div>
            </div>
            <div className={styles.mediaItem}>
              <img src="/media-market.png" alt="Modern Market" />
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaLabel}>Commerce & Trade</span>
              </div>
            </div>
            <div className={styles.mediaItem}>
              <img src="/media-housing.png" alt="Housing Estate" />
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaLabel}>Affordable Housing</span>
              </div>
            </div>
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
            {/* Blog Post 1 */}
            <div className={styles.blogCard}>
              <div className={styles.blogImage}>
                <img src="/blog-infrastructure.png" alt="Infrastructure Update" />
              </div>
              <div className={styles.blogContent}>
                <span className={styles.blogDate}>October 24, 2025</span>
                <h3 className={styles.blogTitle}>Accelerating Infrastructure Development Across Abia North</h3>
                <p className={styles.blogExcerpt}>
                  New highways and bridges are connecting rural communities to major economic hubs, reducing travel time significantly.
                </p>
                <span className={styles.readMore}>
                  Read Article
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className={styles.blogCard}>
              <div className={styles.blogImage}>
                <img src="/blog-healthcare.png" alt="Healthcare Reform" />
              </div>
              <div className={styles.blogContent}>
                <span className={styles.blogDate}>October 18, 2025</span>
                <h3 className={styles.blogTitle}>Primary Healthcare Reform: Reaching the Grassroots</h3>
                <p className={styles.blogExcerpt}>
                  The renovation of primary health centers is ensuring that every citizen has access to quality medical care within their community.
                </p>
                <span className={styles.readMore}>
                  Read Article
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className={styles.blogCard}>
              <div className={styles.blogImage}>
                {/* Reusing generated image for education since we hit limit */}
                <img src="/aba-smart-school.png" alt="Education Technology" />
              </div>
              <div className={styles.blogContent}>
                <span className={styles.blogDate}>October 10, 2025</span>
                <h3 className={styles.blogTitle}>Digital Learning Initiative Launches in 50 Schools</h3>
                <p className={styles.blogExcerpt}>
                  Equipping the next generation with digital skills through the provision of smart devices and high-speed internet in schools.
                </p>
                <span className={styles.readMore}>
                  Read Article
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </div>
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
