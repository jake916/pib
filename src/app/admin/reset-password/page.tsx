"use client";

import styles from '../login/login.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                setError(updateError.message);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/login');
                }, 3000);
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
                <h1 className={styles.title}>Reset Password</h1>
                <p className={styles.subtitle}>Enter your new password below</p>

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
                        <p>Password successfully updated! Redirecting to login page...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>New Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className={`${styles.input} ${styles.passwordInput}`}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.toggleButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                className={styles.input}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
