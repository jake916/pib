'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentAdminRole } from './admin';

export async function getDashboardStats() {
    const role = await getCurrentAdminRole();
    if (!role) throw new Error("Unauthorized");

    const supabase = await createClient();

    let blogCount = 0, feedbackCount = 0, photoCount = 0, videoCount = 0, albumCount = 0;
    
    // 1. Fetch counts based on role
    if (role === 'administrator' || role === 'blog_admin') {
        const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
        blogCount = count || 0;
    }
    if (role === 'administrator' || role === 'customer_admin') {
        const { count } = await supabase.from('feedbacks').select('*', { count: 'exact', head: true });
        feedbackCount = count || 0;
    }
    if (role === 'administrator' || role === 'media_admin') {
        const { count: pCount } = await supabase.from('photos').select('*', { count: 'exact', head: true });
        const { count: vCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
        const { count: aCount } = await supabase.from('albums').select('*', { count: 'exact', head: true });
        photoCount = pCount || 0;
        videoCount = vCount || 0;
        albumCount = aCount || 0;
    }

    const mediaCount = photoCount + videoCount + albumCount;

    // 2. Fetch recent items based on role
    let activityList: any[] = [];

    if (role === 'administrator' || role === 'blog_admin') {
        const { data: recentBlogs } = await supabase.from('blog_posts').select('id, title, created_at').order('created_at', { ascending: false }).limit(3);
        if (recentBlogs) {
            activityList.push(...recentBlogs.map(b => ({
                id: `blog-${b.id}`,
                title: `Blog "${b.title}" published`,
                time: b.created_at,
                type: 'blog'
            })));
        }
    }

    if (role === 'administrator' || role === 'customer_admin') {
        const { data: recentFeedbacks } = await supabase.from('feedbacks').select('id, sender_name, created_at').order('created_at', { ascending: false }).limit(3);
        if (recentFeedbacks) {
            activityList.push(...recentFeedbacks.map(f => ({
                id: `fb-${f.id}`,
                title: `Feedback from ${f.sender_name} received`,
                time: f.created_at,
                type: 'feedback'
            })));
        }
    }

    if (role === 'administrator' || role === 'media_admin') {
        const { data: recentPhotos } = await supabase.from('photos').select('id, title, created_at').order('created_at', { ascending: false }).limit(3);
        if (recentPhotos) {
            activityList.push(...recentPhotos.map(p => ({
                id: `photo-${p.id}`,
                title: `Gallery photo "${p.title}" uploaded`,
                time: p.created_at,
                type: 'media'
            })));
        }
    }

    // Sort combined by date descending
    activityList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Take top 4, format time
    const formattedActivity = activityList.slice(0, 4).map(a => {
        const diffHours = Math.floor((new Date().getTime() - new Date(a.time).getTime()) / (1000 * 60 * 60));
        let timeLabel = `${diffHours} hours ago`;
        if (diffHours >= 24) timeLabel = `${Math.floor(diffHours / 24)} days ago`;
        if (diffHours === 0) timeLabel = 'Just now';
        
        return {
            id: a.id,
            title: a.title,
            time: timeLabel,
            type: a.type
        };
    });

    // Mock day data for charts until we aggregate grouping properly
    const activityData = [
        { name: 'Mon', projects: 0, feedbacks: 2 },
        { name: 'Tue', projects: 0, feedbacks: 5 },
        { name: 'Wed', projects: 0, feedbacks: Math.floor((feedbackCount || 0) * 0.3) },
        { name: 'Thu', projects: 0, feedbacks: Math.floor((feedbackCount || 0) * 0.2) },
        { name: 'Fri', projects: 0, feedbacks: Math.floor((feedbackCount || 0) * 0.4) },
        { name: 'Sat', projects: 0, feedbacks: 3 },
        { name: 'Sun', projects: 0, feedbacks: 1 },
    ];
    
    const maxVal = Math.max(blogCount || 0, mediaCount, feedbackCount || 0, 1);
    const distributionData: any[] = [];
    if (role === 'administrator' || role === 'project_admin') distributionData.push({ name: 'Projects', value: 0, color: '#4F46E5' });
    if (role === 'administrator' || role === 'media_admin') distributionData.push({ name: 'Media', value: (mediaCount / maxVal) * 100 || 5, color: '#059669' });
    if (role === 'administrator' || role === 'blog_admin') distributionData.push({ name: 'Blog', value: ((blogCount || 0) / maxVal) * 100 || 5, color: '#EA580C' });
    if (role === 'administrator' || role === 'customer_admin') distributionData.push({ name: 'Feedback', value: ((feedbackCount || 0) / maxVal) * 100 || 5, color: '#DC2626' });

    return {
        role,
        counts: {
            projects: 0,
            media: mediaCount,
            blog: blogCount || 0,
            feedback: feedbackCount || 0
        },
        recentActivity: formattedActivity,
        activityData,
        distributionData
    };
}
