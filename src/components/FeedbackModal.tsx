'use client';

import { useState, useEffect, useRef } from 'react';
import { submitFeedback } from '@/app/actions/feedback';
import styles from './FeedbackModal.module.css';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialProjectId?: string;
}

interface ProjectOption {
    id: string;
    name: string;
}

export default function FeedbackModal({ isOpen, onClose, initialProjectId }: FeedbackModalProps) {
    const [formData, setFormData] = useState({
        project: initialProjectId || '',
        otherProjectName: '',
        name: '',
        email: '',
        phone: '',
        location: '',
        subject: '',
        message: ''
    });

    const [projects, setProjects] = useState<ProjectOption[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch projects from DB
    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('projects')
                    .select('id, title')
                    .order('title', { ascending: true });

                if (error) throw error;

                const projectOptions = data.map((p: any) => ({
                    id: p.id,
                    name: p.title
                }));

                setProjects([...projectOptions, { id: 'others', name: 'Others' }]);
            } catch (err) {
                console.error('Error fetching projects:', err);
                // Fallback to minimal list if fetch fails
                setProjects([{ id: 'others', name: 'Others' }]);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    // Update form if initialProjectId changes or modal opens
    useEffect(() => {
        if (isOpen && initialProjectId) {
            setFormData(prev => ({
                ...prev,
                project: initialProjectId
            }));
        }
    }, [isOpen, initialProjectId]);


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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError(null);

        if (!file) {
            setSelectedFile(null);
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setFileError('Please upload a JPG or PNG image.');
            setSelectedFile(null);
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setFileError('File size must be less than 5MB.');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const uploadImage = async (file: File) => {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `feedback-images/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('feedbacks')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('feedbacks')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = null;
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            const isOthers = formData.project === 'others';
            const selectedProject = projects.find(p => p.id === formData.project);
            const finalProjectName = isOthers ? formData.otherProjectName : (selectedProject?.name || '');

            const result = await submitFeedback({
                name: formData.name,
                email: formData.email.toLowerCase(),
                phone: formData.phone,
                location: formData.location,
                project: formData.project,
                project_name: finalProjectName,
                subject: formData.subject,
                message: formData.message,
                image_url: imageUrl
            });

            // Reset form
            setFormData({
                project: '',
                otherProjectName: '',
                name: '',
                email: '',
                phone: '',
                location: '',
                subject: '',
                message: ''
            });
            setSelectedFile(null);

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
            <div className={styles.backdrop} onClick={onClose}></div>

            <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ''}`}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Submit Feedback or Report</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        <X size={24} />
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
                            <option value="">{isLoadingProjects ? 'Loading projects...' : '-- Choose a project --'}</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>

                        {/* Other Project Input */}
                        {formData.project === 'others' && (
                            <div className={styles.otherProjectGroup}>
                                <label htmlFor="otherProjectName" className={styles.label}>
                                    Project Name <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="otherProjectName"
                                    name="otherProjectName"
                                    value={formData.otherProjectName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter the project name"
                                    className={styles.input}
                                />
                            </div>
                        )}
                    </div>

                    {/* Personal Details Row */}
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                    </div>

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
                            rows={4}
                            placeholder="Provide detailed information about your feedback or report..."
                            className={styles.textarea}
                        ></textarea>
                    </div>

                    {/* Image Upload */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Evidence Image (Optional)
                        </label>
                        <div 
                            className={`${styles.fileInputContainer} ${selectedFile ? styles.fileSelected : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/jpg"
                                className={styles.fileInput}
                            />
                            {selectedFile ? (
                                <div className={styles.fileInfo}>
                                    <FileImage size={32} />
                                    <span className={styles.fileSelectedText}>{selectedFile.name}</span>
                                    <span className={styles.fileHint}>Click to change image</span>
                                </div>
                            ) : (
                                <div className={styles.fileInfo}>
                                    <Upload size={32} />
                                    <span>Click to upload image (JPG, PNG)</span>
                                    <span className={styles.fileHint}>Max size: 5MB</span>
                                </div>
                            )}
                        </div>
                        {fileError && (
                            <div className={styles.errorText}>
                                <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                {fileError}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn btn-primary ${styles.submitButton}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Send Feedback'}
                        {!isSubmitting && (
                            <Upload size={20} />
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}
