"use client";

import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Loader2, MessageSquareText } from 'lucide-react';
import { getMessages, markAsRead, deleteMessage, ContactMessage } from '@/app/actions/contact';
import { toast } from 'sonner';

export default function AdminContactPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isReading, setIsReading] = useState<string | null>(null);

    const loadMessages = async () => {
        try {
            setIsLoading(true);
            const data = await getMessages();
            setMessages(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch messages');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            setIsReading(id);
            await markAsRead(id);
            setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, is_read: true } : msg));
            toast.success('Message marked as read');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        } finally {
            setIsReading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            setIsDeleting(id);
            await deleteMessage(id);
            setMessages(prev => prev.filter(msg => msg.id !== id));
            toast.success('Message deleted successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete message');
        } finally {
            setIsDeleting(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const parseMessage = (rawMessage: string) => {
        let phone = 'Not provided';
        let content = rawMessage;
        if (rawMessage.startsWith('Phone: ')) {
            const parts = rawMessage.split('\n\n');
            phone = parts[0].replace('Phone: ', '');
            content = parts.slice(1).join('\n\n');
        }
        return { phone, content };
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>Contact Messages</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>View and manage submissions from the public contact form.</p>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
                </div>
            ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <MessageSquareText size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>No messages yet</h3>
                    <p style={{ color: '#64748B' }}>When someone submits a message via the contact form, it will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => {
                        const { phone, content } = parseMessage(msg.message);
                        return (
                            <div key={msg.id} style={{
                                backgroundColor: msg.is_read ? 'white' : '#EFF6FF',
                                border: `1px solid ${msg.is_read ? '#E2E8F0' : '#BFDBFE'}`,
                                borderLeft: msg.is_read ? '1px solid #E2E8F0' : '4px solid #3B82F6',
                                borderRadius: '0.5rem',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                opacity: msg.is_read ? 0.75 : 1,
                                transition: 'opacity 0.2s'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: msg.is_read ? 500 : 600, color: '#0F172A', margin: 0 }}>
                                                {msg.name}
                                            </h3>
                                            {!msg.is_read && (
                                                <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', color: '#64748B', fontSize: '0.875rem' }}>
                                            <a href={`mailto:${msg.email}`} style={{ color: '#3B82F6', textDecoration: 'none' }}>{msg.email}</a>
                                            <span>•</span>
                                            <span>{phone}</span>
                                            <span>•</span>
                                            <span>{formatDate(msg.created_at)}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {!msg.is_read && (
                                            <button
                                                onClick={() => handleMarkAsRead(msg.id)}
                                                disabled={isReading === msg.id}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: isReading === msg.id ? 'not-allowed' : 'pointer' }}
                                            >
                                                {isReading === msg.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <MailOpen size={16} />}
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            disabled={isDeleting === msg.id}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: isDeleting === msg.id ? 'not-allowed' : 'pointer' }}
                                        >
                                            {isDeleting === msg.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                
                                {msg.subject && (
                                    <div style={{ fontWeight: 500, color: '#334155', fontSize: '0.9375rem' }}>
                                        Subject: {msg.subject}
                                    </div>
                                )}
                                
                                <div style={{ padding: '1rem', backgroundColor: msg.is_read ? '#F8FAFC' : '#DBEAFE', borderRadius: '0.375rem', color: '#334155', fontSize: '0.9375rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                    {content}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
