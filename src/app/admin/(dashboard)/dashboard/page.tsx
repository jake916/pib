"use client";

import { useEffect, useState } from 'react';
import {
    FolderKanban,
    Image as ImageIcon,
    FileText,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ChevronRight,
    Plus,
    Loader2
} from 'lucide-react';
import styles from './dashboard.module.css';
import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/dashboard';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';

export default function DashboardPage() {
    const [statsData, setStatsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getDashboardStats();
                setStatsData(data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.dashboardContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
            </div>
        );
    }

    const userRole = statsData?.role || 'none';

    // Map fetched data to visual counters, conditionally included
    const stats = [];
    
    if (userRole === 'administrator' || userRole === 'project_admin') {
        stats.push({ label: 'Total Projects', value: statsData?.counts.projects || '0', icon: FolderKanban, trend: '+0%', trendUp: true, data: [0, 0, 0, 0, 0, 0, 0] });
    }
    if (userRole === 'administrator' || userRole === 'media_admin') {
        stats.push({ label: 'Media Gallery', value: statsData?.counts.media.toString() || '0', icon: ImageIcon, trend: '+5%', trendUp: true, data: [2, 4, 3, 5, 4, 6, 5] });
    }
    if (userRole === 'administrator' || userRole === 'blog_admin') {
        stats.push({ label: 'Blog Posts', value: statsData?.counts.blog.toString() || '0', icon: FileText, trend: '+12%', trendUp: true, data: [3, 2, 3, 4, 2, 1, 3] });
    }
    if (userRole === 'administrator' || userRole === 'customer_admin') {
        stats.push({ label: 'Feedbacks', value: statsData?.counts.feedback.toString() || '0', icon: MessageSquare, trend: '+24%', trendUp: true, data: [10, 15, 12, 18, 20, 25, 22] });
    }

    const activityData = statsData?.activityData || [];
    const distributionData = statsData?.distributionData || [];
    const recentActivity = statsData?.recentActivity || [];


    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Overview of system performance and activities</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <div className={styles.statIcon}>
                                    <Icon size={18} />
                                </div>
                                <div className={index === 2 ? styles.trendDown : styles.trendUp}>
                                    {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                            <div>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>

                            {/* Mini Chart */}
                            <div className={styles.miniChartContainer}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stat.data.map((val, i) => ({ val }))}>
                                        <Area
                                            type="monotone"
                                            dataKey="val"
                                            stroke={index === 2 ? "#EF4444" : "#10B981"}
                                            fill={index === 2 ? "#FEF2F2" : "#ECFDF5"}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid: Activity Overview & Content Distribution */}
            <div className={styles.contentGrid}>
                {/* Activity bar chart */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Activity Overview</h2>
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 11 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 11 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                {/* Red color for bars as requested */}
                                <Bar dataKey="projects" fill="#EF4444" radius={[4, 4, 0, 0]} name="Projects" />
                                <Bar dataKey="feedbacks" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Feedbacks" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Content Distribution Donut */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Content Distribution</h2>
                    </div>
                    <div style={{ height: 200, position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B' }}>100%</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        {distributionData.map((item: any, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#64748B' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.color }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Quick Actions & Recent Activity */}
            <div className={styles.bottomGrid}>
                {/* Quick Actions */}
                <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Quick Actions</h2>
                    <div className={styles.actionsGrid}>
                        {(userRole === 'administrator' || userRole === 'project_admin') && (
                            <Link href="/admin/projects" style={{ textDecoration: 'none' }}>
                                <button className={styles.actionButton} style={{ width: '100%' }}>
                                    <Plus size={18} className={styles.actionIcon} />
                                    New Project
                                </button>
                            </Link>
                        )}
                        {(userRole === 'administrator' || userRole === 'media_admin') && (
                            <Link href="/admin/media" style={{ textDecoration: 'none' }}>
                                <button className={styles.actionButton} style={{ width: '100%' }}>
                                    <ImageIcon size={18} className={styles.actionIcon} />
                                    Upload Media
                                </button>
                            </Link>
                        )}
                        {(userRole === 'administrator' || userRole === 'blog_admin') && (
                            <Link href="/admin/blog/create" style={{ textDecoration: 'none' }}>
                                <button className={styles.actionButton} style={{ width: '100%' }}>
                                    <FileText size={18} className={styles.actionIcon} />
                                    Write Blog Post
                                </button>
                            </Link>
                        )}
                        {userRole === 'administrator' && (
                            <Link href="/admin/admins" style={{ textDecoration: 'none' }}>
                                <button className={styles.actionButton} style={{ width: '100%' }}>
                                    <FolderKanban size={18} className={styles.actionIcon} />
                                    Manage Admins
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Activity</h2>
                        <Link href="#" style={{ fontSize: '0.8rem', color: '#4F46E5', fontWeight: 600 }}>View all</Link>
                    </div>
                    <div className={styles.activityList}>
                        {recentActivity.map((activity: any) => (
                            <div key={activity.id} className={styles.activityItem}>
                                <div className={`${styles.activityAvatar} ${activity.type === 'project' ? styles.avatarProject :
                                        activity.type === 'feedback' ? styles.avatarFeedback :
                                            activity.type === 'blog' ? styles.avatarBlog : styles.avatarMedia
                                    }`}>
                                    {activity.type === 'project' ? 'PR' :
                                        activity.type === 'feedback' ? 'FB' :
                                            activity.type === 'blog' ? 'BL' : 'MD'}
                                </div>
                                <div className={styles.activityInfo}>
                                    <h4 className={styles.activityTitle}>{activity.title}</h4>
                                    <div className={styles.activityMeta}>
                                        <Calendar size={10} />
                                        <span>{activity.time}</span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className={styles.activityArrow} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
