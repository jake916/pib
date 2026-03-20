"use client";

import styles from '../login/login.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.cont}>
            <div className={styles.card}>
                <h1 className={styles.title}>Forgot Password</h1>
                <p className={styles.subtitle}>Enter your email to receive a reset link</p>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '4px',
                        color: '#c33',
                        fontSize: '0.875rem',
                        textAlign: 'left'
                    }}>
                        {error}
                    </div>
                )}

                {success ? (
                    <div className={styles.successMessage}>
                        <p>Password reset link has been sent to your email address. Please check your inbox and follow the instructions.</p>
                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link href="/admin/login" className={styles.button} style={{ textDecoration: 'none', display: 'inline-block' }}>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className={styles.input}
                                placeholder="admin@pib.gov.ng"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {!success && (
                    <Link href="/admin/login" className={styles.backLink}>
                        ← Back to Login
                    </Link>
                )}
            </div>
        </div>
    );
}
