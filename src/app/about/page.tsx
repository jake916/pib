import styles from './about.module.css';
import AnimatedView from '@/components/AnimatedView';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <main>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <Image
                        src="/about_hero_new_1770455338052.png"
                        alt="PIB Hero Background"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className={styles.heroOverlay}></div>
                <div className="container">
                    <AnimatedView className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>About the Project Implementation Bureau</h1>
                        <p className={styles.heroSubtitle}>
                            Strengthening coordination, monitoring, and delivery of government projects across Abia State.
                        </p>
                    </AnimatedView>
                </div>
            </section>

            {/* Leadership */}
            <section className={styles.leadership}>
                <div className="container">

                    <div className={styles.governorCard}>
                        <AnimatedView delay={0.2} className={styles.governorImageContainer}>
                            <Image
                                src="/Governor Alex Otti 2 (1).jpeg"
                                alt="His Excellency, Dr. Alex Otti"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </AnimatedView>
                        <AnimatedView delay={0.4} className={styles.governorContent}>
                            <span className={styles.governorBadge}>Executive Leadership</span>
                            <h3 className={styles.governorName}>His Excellency, Dr. Alex Otti</h3>
                            <div className={styles.governorRole}>Executive Governor, Abia State</div>
                            <div className={styles.divider}></div>
                            <p className={styles.governorBio}>
                                The Abia State Project Implementation Bureau (ASPIB) is an initiative established by Alex Chioma Otti in 2025 to ensure that quality standards are consistently adhered to across all infrastructural development projects in Abia State. The Bureau utilizes project management principles and best practices as tools for quality assurance and quality control, ensuring that government projects are executed efficiently, transparently, and in accordance with established standards.
                            </p>
                        </AnimatedView>
                    </div>
                </div>
            </section>

            {/* Overview - Centered Section */}
            <section className={styles.overview}>
                <div className="container">
                    <AnimatedView delay={0.2} className={styles.overviewContentCentered}>
                        <h2 className={styles.sectionTitle}>Overview</h2>
                        <p className={styles.overviewText}>
                            The PIB was established to ensure maximum value, quality standard, adherence to schedule and budget on Projects with significant budget implications across Abia State. 
                        </p>
                        <p className={styles.overviewText}>
                            It aligns with the Abia State Government’s commitment to ensure that public resources are applied judiciously.
                        </p>
                        <p className={styles.overviewText}>
                            The PIB serves as a Design Assurance Gate, ensuring preliminary investigation, multi-disciplinary review, adherence to structural code, material testing, before site mobilization and during the execution of projects.
                        </p>
                    </AnimatedView>
                </div>
            </section>

            {/* Our Mandate (Split Section Reversed) */}
            <section className={`${styles.sectionBlock} ${styles.bgSurface}`}>
                <div className="container">
                    <div className={styles.splitSectionReversed}>
                        <AnimatedView delay={0.4} className={styles.imageContainer}>
                            <Image
                                src="/WhatsApp Image 2026-02-17 at 8.38.43 PM (12).jpeg"
                                alt="Inspection Mandate"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </AnimatedView>
                        <AnimatedView delay={0.2} className={styles.contentContainer}>
                            <h2 className={styles.sectionTitle}>Our Mission</h2>
                            <div className={styles.visionText}>
                                To ensure cost efficient and top-quality implementation of government projects that improve the lives of citizens.
                            </div>
                        </AnimatedView>
                    </div>
                </div>
            </section>

            {/* Our Vision (Split Section) */}
            <section className={`${styles.sectionBlock} ${styles.bgWhite}`}>
                <div className="container">
                    <div className={styles.splitSection}>
                        <AnimatedView delay={0.2} className={styles.contentContainer}>
                            <h2 className={styles.sectionTitle}>Our Vision</h2>
                            <div className={styles.visionText}>
                                To be a model government agency recognized for excellence in quality, accountability, and citizen-centered service delivery, upholding zero tolerance for substandard performance on project.
                            </div>
                        </AnimatedView>
                        <AnimatedView delay={0.4} className={styles.imageContainer}>
                            <Image
                                src="/WhatsApp Image 2026-02-17 at 8.38.43 PM (4).jpeg"
                                alt="Our Vision"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </AnimatedView>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className={styles.leadership}>
                <div className="container">
                    <div className={styles.leadershipHeader}>
                        <h2 className={styles.sectionTitle}>Our Leadership</h2>
                        <p className={styles.leadershipText}>
                            The bureau is driven by the state's vision of infrastructure excellence and quality assurance.
                        </p>
                    </div>

                    <div className={styles.leaderCardCentered}>
                        <AnimatedView delay={0.2} className={styles.leaderImageContainer}>
                            <Image
                                src="/WhatsApp Image 2026-06-24 at 11.23.53.jpeg"
                                alt="Mr. Onyinye Nwosu (M.Sc, PMP)"
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'top' }}
                                priority
                            />
                        </AnimatedView>
                        <AnimatedView delay={0.4} className={styles.leaderContentCentered}>
                    
                            <h3 className={styles.governorName}>
                                Mr. Onyinye Nwosu <span className={styles.qualifications}>(M.Sc, PMP)</span>
                            </h3>
                            <div className={styles.governorRole}>Director General (DG)</div>
                            <div className={styles.leaderSubRole}>Abia State Project Implementation Bureau</div>
                        </AnimatedView>
                    </div>
                </div>
            </section> 

            {/* Full Width Impact Image */}
            <section className={styles.fullWidthImageSection}>
                <Image
                    src="/PIB PICS (1).jpeg"
                    alt="Abia State Landscape"
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </section>

            
        </main>
    );
}
