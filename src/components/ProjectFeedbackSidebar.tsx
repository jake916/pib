'use client';

import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import styles from '@/app/projects/[id]/project-detail.module.css';

interface ProjectFeedbackSidebarProps {
    projectId: string;
}

export default function ProjectFeedbackSidebar({ projectId }: ProjectFeedbackSidebarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={styles.feedbackCard}>
                <h3 className={styles.cardTitle}>Have Feedback?</h3>
                <p className={styles.feedbackText}>
                    Your observation helps us ensure quality and accountability.
                </p>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className={styles.feedbackBtn}
                    style={{ border: 'none', cursor: 'pointer', width: '100%' }}
                >
                    Submit Report
                </button>
            </div>

            <FeedbackModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                initialProjectId={projectId}
            />
        </>
    );
}
