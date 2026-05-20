import styles from './about.module.css';
import AnimatedView from '@/components/AnimatedView';
import Image from 'next/image';

export default function AboutPage() {
    const leaders = [
        {
            name: "His Excellency, Dr. Alex Otti",
            role: "Executive Governor, Abia State",
            bio: "Committed to delivering transparent, cost-efficient, and top-quality government projects to improve the lives of citizens.",
            image: "/Governor Alex Otti 2 (1).jpeg"
        }
    ];

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

            {/* Overview - Split Section */}
            <section className={styles.overview}>
                <div className="container">
                    <div className={styles.splitSection}>
                        <AnimatedView delay={0.2} className={styles.contentContainer}>
                            <h2 className={styles.sectionTitle}>Overview</h2>
                            <p className={styles.overviewText}>
                                The PIB was established to ensure maximum value, quality standard, adherence to schedule and budget on Projects with significant budget implications across Abia State. 
                            </p>
                            <p className={styles.overviewText}>
                                It aligns with the Abia State Government’s commitment to ensure that public resources are applied judiciously and value for money review.
                            </p>
                            <p className={styles.overviewText}>
                                The PIB serves as a Design Assurance Gate, ensuring preliminary investigation, multi-disciplinary review, adherence to structural code, material testing, before site mobilization and during the execution of projects.
                            </p>
                        </AnimatedView>
                        <AnimatedView delay={0.4} className={styles.imageContainer}>
                            <Image
                                src="/3.jpg"
                                alt="PIB Overview"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </AnimatedView>
                    </div>
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
                                src="/media_tech_hub_1770377634654.png"
                                alt="Future Vision"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
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

            {/* Leadership */}
            <section className={styles.leadership}>
                <div className="container">
                    <div className={styles.leadershipHeader}>
                        <h2 className={styles.sectionTitle}>Leadership</h2>
                        <p className={styles.leadershipText}>
                            The Project Implementation Bureau is led by experienced professionals responsible for overseeing project monitoring, coordination, and reporting functions.
                        </p>
                    </div>

                    <div className={styles.leadershipGrid}>
                        {leaders.map((leader, index) => (
                            <AnimatedView key={index} delay={0.2 + (index * 0.1)} className={styles.leaderCard}>
                                <div className={styles.leaderImage}>
                                    {leader.image ? (
                                        <Image
                                            src={leader.image}
                                            alt={leader.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', color: '#9ca3af', fontSize: '3rem', fontWeight: 'bold' }}>
                                            {leader.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.leaderInfo}>
                                    <h3 className={styles.leaderName}>{leader.name}</h3>
                                    <div className={styles.leaderRole}>{leader.role}</div>
                                    <p className={styles.leaderBio}>{leader.bio}</p>
                                </div>
                            </AnimatedView>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
