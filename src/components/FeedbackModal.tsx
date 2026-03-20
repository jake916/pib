'use client';

import { useState, useEffect } from 'react';
import { submitFeedback } from '@/app/actions/feedback';
import styles from './FeedbackModal.module.css';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [formData, setFormData] = useState({
        project: '',
        name: '',
        email: '',
        phone: '',
        location: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sample projects - in a real app, this would be fetched from an API
    const projects = [
        { id: '1', name: 'Aba Smart School Initiative' },
        { id: '2', name: 'Umuahia General Hospital Upgrade' },
        { id: '3', name: 'Rural Access Roads Project' },
        { id: '4', name: 'Digital Transformation Tech Hub' },
        { id: '5', name: 'Water Treatment Facility' },
        { id: '6', name: 'Modern Market Complex' },
        { id: '7', name: 'Solar Power Grid Installation' },
        { id: '8', name: 'Affordable Housing Estate' }
    ];

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const selectedProject = projects.find(p => p.id === formData.project);

        try {
            const result = await submitFeedback({
                name: formData.name,
                email: formData.email.toLowerCase(),
                phone: formData.phone,
                location: formData.location,
                project: formData.project,
                project_name: selectedProject?.name || '',
                subject: formData.subject,
                message: formData.message
            });

            // Reset form
            setFormData({
                project: '',
                name: '',
                email: '',
                phone: '',
                location: '',
                subject: '',
                message: ''
            });

            setIsSubmitting(false);
            alert(`Thank you for your feedback!\n\nReference ID: ${result.id}\n\nYou can track your feedback using your email or phone number on the Reports & Feedback page.`);
            onClose();
        } catch (error: any) {
            setIsSubmitting(false);
            alert(`Failed to submit feedback: ${error.message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className={styles.backdrop} onClick={onClose}></div>

            {/* Modal */}
            <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ''}`}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Submit Feedback or Report</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Project Selection */}
                    <div className={styles.formGroup}>
                        <label htmlFor="project" className={styles.label}>
                            Select Project <span className={styles.required}>*</span>
                        </label>
                        <select
                            id="project"
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            required
                            className={styles.select}
                        >
                            <option value="">-- Choose a project --</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Your Name <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className={styles.input}
                        />
                    </div>

                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email Address <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                            className={styles.input}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>
                            Phone Number <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="080XXXXXXXX"
                            className={styles.input}
                        />
                    </div>

                    {/* Location */}
                    <div className={styles.formGroup}>
                        <label htmlFor="location" className={styles.label}>
                            Location <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Aba, Umuahia"
                            className={styles.input}
                        />
                    </div>

                    {/* Subject */}
                    <div className={styles.formGroup}>
                        <label htmlFor="subject" className={styles.label}>
                            Subject <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Brief summary of your feedback"
                            className={styles.input}
                        />
                    </div>

                    {/* Message */}
                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>
                            Message <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            placeholder="Provide detailed information about your feedback or report..."
                            className={styles.textarea}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn btn-primary ${styles.submitButton}`}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Feedback'}
                        {!isSubmitting && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}
