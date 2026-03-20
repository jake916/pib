'use client';

import { useState } from 'react';
import styles from './contact.module.css';
import { submitMessage } from '@/app/actions/contact';
import { toast } from 'sonner';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await submitMessage({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: `Phone: ${formData.phone}\n\n${formData.message}`
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            toast.success('Thank you for contacting us! We will get back to you shortly.');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Contact the Project Implementation Bureau</h1>
                    <p className={styles.heroSubtitle}>
                        For official inquiries, project-related communication, or general feedback, please use the contact details or form below.
                    </p>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className={styles.contactSection}>
                <div className="container">
                    <div className={styles.contentGrid}>
                        {/* Office Contact Information */}
                        <div className={styles.contactInfo}>
                            <h2 className={styles.sectionTitle}>Office Contact Information</h2>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <div className={styles.infoContent}>
                                    <h3>Office Address</h3>
                                    <p>Project Implementation Bureau<br />
                                        Government House Complex<br />
                                        Umuahia, Abia State<br />
                                        Nigeria</p>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                </div>
                                <div className={styles.infoContent}>
                                    <h3>Email</h3>
                                    <p><a href="mailto:info@abiapib.gov.ng">info@abiapib.gov.ng</a></p>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </div>
                                <div className={styles.infoContent}>
                                    <h3>Phone</h3>
                                    <p><a href="tel:+2348012345678">+234 801 234 5678</a></p>
                                </div>
                            </div>

                            <div className={styles.officeHours}>
                                <h3>Office Hours</h3>
                                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                                <p>Saturday - Sunday: Closed</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className={styles.formContainer}>
                            <h2 className={styles.sectionTitle}>Send Us a Message</h2>
                            <p className={styles.formIntro}>
                                Please complete the form below and a representative of the Project Implementation Bureau will review your message.
                            </p>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Full Name <span className={styles.required}>*</span></label>
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

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email Address <span className={styles.required}>*</span></label>
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

                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Phone Number <span className={styles.required}>*</span></label>
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
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="subject">Subject <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Brief summary of your inquiry"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Message <span className={styles.required}>*</span></label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder="Provide detailed information about your inquiry..."
                                        className={styles.textarea}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn btn-primary ${styles.submitButton}`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    {!isSubmitting && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
