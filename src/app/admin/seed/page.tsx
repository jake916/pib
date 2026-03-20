"use client";

import { useState } from 'react';
import styles from '../login/login.module.css';
import Link from 'next/link';

export default function SeedAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSeed = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/admin/seed', {
                method: 'POST',
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Failed to seed admin user' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.cont}>
            <div className={styles.card}>
                <h1 className={styles.title}>Seed Admin User</h1>
                <p className={styles.subtitle}>Create the initial admin account for the system</p>

                {result && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor: result.error ? '#fee' : '#efe',
                        border: `1px solid ${result.error ? '#fcc' : '#cfc'}`,
                        borderRadius: '4px',
                        color: result.error ? '#c33' : '#3c3',
                        fontSize: '0.875rem'
                    }}>
                        {result.error ? (
                            <div>
                                <strong>Error:</strong> {result.error}
                            </div>
                        ) : (
                            <div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <strong>✅ {result.message}</strong>
                                </div>
                                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                    <div><strong>Email:</strong> {result.credentials.email}</div>
                                    <div><strong>Password:</strong> {result.credentials.password}</div>
                                </div>
                                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                                    ⚠️ <strong>Important:</strong> Change your password after first login!
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleSeed}
                    className={styles.button}
                    disabled={isLoading}
                    style={{ width: '100%' }}
                >
                    {isLoading ? 'Seeding...' : 'Seed Admin User'}
                </button>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/admin/login" className={styles.backLink}>
                        Go to Login →
                    </Link>
                </div>
            </div>
        </div>
    );
}
