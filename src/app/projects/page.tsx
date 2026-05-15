"use client";

import React, { useState, useEffect, useMemo } from 'react';
import styles from './projects.module.css';
import AbiaMap from '@/components/AbiaMap';
import { Project, getProjects, getCategories, Category } from '@/app/actions/projects';
import AnimatedView from '@/components/AnimatedView';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, ArrowRight, FolderKanban, Search, Filter, RotateCcw, Loader2 } from 'lucide-react';

export default function ProjectsPage() {
    const [geoData, setGeoData] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedLga, setSelectedLga] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load GeoJSON
        fetch('/abia_state_lgas.geojson')
            .then(res => res.json())
            .then(data => {
                setGeoData(data);
                if (projects.length > 0) setLoading(false);
            })
            .catch(err => {
                console.error("Error loading geojson:", err);
            });

        // Load Projects and Categories from DB
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const projectsData = await getProjects();
            setProjects(projectsData);
            
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const lgaList = useMemo(() => {
        if (!geoData) return [];
        return geoData.features.map((f: any) => f.properties.lga).sort();
    }, [geoData]);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesLga = !selectedLga || project.lga.toLowerCase() === selectedLga.toLowerCase();
            const matchesSector = !selectedSector || project.category === selectedSector;
            const matchesSearch = !searchQuery || 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.lga.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesLga && matchesSector && matchesSearch;
        });
    }, [selectedLga, selectedSector, searchQuery, projects]);

    const handleReset = () => {
        setSelectedLga(null);
        setSelectedSector('');
        setSearchQuery('');
    };

    return (
        <main className={styles.projectsPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <AnimatedView className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Project Implementation Tracker</h1>
                        <p className={styles.heroSubtitle}>
                            Ensuring transparency and accountability in every government project across Abia State.
                        </p>
                    </AnimatedView>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="container">
                <AnimatedView delay={0.2} className={styles.filterBar}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Search Projects</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input 
                                type="text" 
                                className={styles.input} 
                                placeholder="Keywords (e.g. Road, School...)" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>By Sector</label>
                        <select 
                            className={styles.select}
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                        >
                            <option value="">All Sectors</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>By LGA</label>
                        <select 
                            className={styles.select}
                            value={selectedLga || ''}
                            onChange={(e) => setSelectedLga(e.target.value || null)}
                        >
                            <option value="">All Regions</option>
                            {lgaList.map((lga: string) => (
                                <option key={lga} value={lga}>{lga}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className={styles.resetBtn} onClick={handleReset} title="Reset Filters">
                            <RotateCcw size={20} />
                        </button>
                        <button className={styles.searchBtn}>
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>
                </AnimatedView>
            </div>

            {/* Main Interactive Content */}
            <section className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* LEFT: MAP */}
                        <AnimatedView delay={0.3} className={styles.mapContainer}>
                            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Abia State Map</h3>
                                {selectedLga && (
                                    <button 
                                        onClick={() => setSelectedLga(null)}
                                        style={{ color: '#D72638', fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>
                            {loading ? (
                                <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                    Loading Map Data...
                                </div>
                            ) : geoData ? (
                                <AbiaMap 
                                    geoData={geoData} 
                                    onLgaSelect={setSelectedLga} 
                                    selectedLga={selectedLga} 
                                />
                            ) : (
                                <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                                    Failed to load map data.
                                </div>
                            )}
                        </AnimatedView>

                        {/* RIGHT: DETAILS */}
                        <AnimatedView delay={0.4} className={styles.contentArea}>
                            <div className={styles.selectionInfo}>
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={selectedLga || 'all'}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={styles.lgaHeader}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D72638', marginBottom: '8px' }}>
                                                {selectedLga ? <MapPin size={18} /> : <Filter size={18} />}
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {selectedLga ? 'Local Government Area' : 'Project Search Results'}
                                                </span>
                                            </div>
                                            <h2 className={styles.lgaName}>{selectedLga || 'Showing All Projects'}</h2>
                                        </div>

                                        <div className={styles.projectList}>
                                            <h3 style={{ fontSize: '1rem', color: '#64748B', marginBottom: '12px' }}>
                                                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} found
                                            </h3>
                                            
                                            {filteredProjects.length > 0 ? (
                                                filteredProjects.map(project => (
                                                    <div key={project.id} className={styles.projectCard}>
                                                        <div className={styles.projectHeader}>
                                                            <div>
                                                                <h4 className={styles.projectTitle}>{project.title}</h4>
                                                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                                                                    {project.lga} • {project.category}
                                                                </div>
                                                            </div>
                                                            <span className={`${styles.badge} ${
                                                                project.status === 'Ongoing' ? styles.badgeOngoing : 
                                                                project.status === 'Completed' ? styles.badgeCompleted : 
                                                                styles.badgePlanned
                                                            }`}>
                                                                {project.status}
                                                            </span>
                                                        </div>
                                                        <p className={styles.projectDesc}>{project.description}</p>
                                                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                                                            <Link href={`/projects/${project.id}`} className={styles.viewDetailsBtn}>
                                                                View details <ArrowRight size={14} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.emptyState}>
                                                    <FolderKanban size={48} strokeWidth={1} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                                    <p>No projects match your current filters. Try adjusting your search or selecting a different region.</p>
                                                    <button 
                                                        onClick={handleReset}
                                                        style={{ marginTop: '16px', color: '#D72638', background: 'none', border: '1px solid #D72638', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                                                    >
                                                        Reset All Filters
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </AnimatedView>
                    </div>
                </div>
            </section>
        </main>
    );
}
