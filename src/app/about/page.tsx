import styles from './about.module.css';
import AnimatedView from '@/components/AnimatedView';
import Image from 'next/image';

export default function AboutPage() {
    const leaders = [
        {
            name: "Dr. Ngozi Okonjo",
            role: "Director General",
            bio: "Over 20 years of experience in public administration and infrastructure development.",
            image: "/leader_ngozi_1770455369602.png"
        },
        {
            name: "Engr. Chinedu Kalu",
            role: "Head of Operations",
            bio: "Civil engineer specializing in sustainable urban planning and construction management.",
            image: "/leader_chinedu_1770455384985.png"
        },
        {
            name: "Mrs. Amaka Uche",
            role: "Head of Monitoring",
            bio: "Expert in project evaluation, data analytics, and performance tracking.",
            image: "/leader_amaka_1770455399271.png"
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
                                The Project Implementation Bureau was established to strengthen the coordination, monitoring, and delivery of government projects across Abia State.
                            </p>
                            <p className={styles.overviewText}>
                                The Bureau serves as a central oversight body, ensuring that approved projects are implemented efficiently, tracked consistently, and reported accurately in line with government priorities and established standards.
                            </p>
                            <p className={styles.overviewText}>
                                Through structured monitoring and data-driven reporting, the Bureau supports improved project outcomes and enhances transparency in public infrastructure and service delivery.
                            </p>
                        </AnimatedView>
                        <AnimatedView delay={0.4} className={styles.imageContainer}>
                            <Image
                                src="/about_overview_new_1770455353653.png"
                                alt="PIB Collaboration"
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
                                src="/mandate_inspection_1770377294088.png"
                                alt="Inspection Mandate"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </AnimatedView>
                        <AnimatedView delay={0.2} className={styles.contentContainer}>
                            <h2 className={styles.sectionTitle}>Our Mandate</h2>
                            <ul className={styles.list}>
                                <li className={styles.listItem}>Monitoring the implementation of government-approved projects</li>
                                <li className={styles.listItem}>Tracking project progress, timelines, and completion status</li>
                                <li className={styles.listItem}>Supporting accountability through structured reporting</li>
                                <li className={styles.listItem}>Coordinating with implementing agencies and stakeholders</li>
                                <li className={styles.listItem}>Providing verified project information to government and the public</li>
                            </ul>
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
                                "To ensure that public projects across Abia State are delivered efficiently, transparently, and in the best interest of citizens."
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
                    src="/abia_state_landscape_1770455748660.png"
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
