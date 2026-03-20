"use client";

import { useEffect, useState } from 'react';
import { Reply, Trash2, Loader2, MessageSquareText, Search } from 'lucide-react';
import { getAllFeedbacks, replyToFeedback, deleteFeedback, Feedback } from '@/app/actions/feedback';
import { toast } from 'sonner';

export default function AdminFeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadFeedbacks = async () => {
        try {
            setIsLoading(true);
            const data = await getAllFeedbacks();
            setFeedbacks(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch feedbacks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const handleReply = async (id: string) => {
        if (!replyText.trim()) {
            toast.error("Reply cannot be empty.");
            return;
        }
        
        try {
            setIsSubmittingReply(true);
            await replyToFeedback(id, replyText);
            
            // Optimistic UI Update
            setFeedbacks(prev => prev.map(f => f.id === id ? { 
                ...f, 
                status: 'replied', 
                response: replyText, 
                responded_at: new Date().toISOString() 
            } : f));
            
            toast.success('Reply submitted successfully');
            setReplyingTo(null);
            setReplyText("");
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit reply');
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback report?')) return;

        try {
            setIsDeleting(id);
            await deleteFeedback(id);
            setFeedbacks(prev => prev.filter(f => f.id !== id));
            toast.success('Feedback deleted successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete feedback');
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

    const filteredFeedbacks = feedbacks.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>User Feedbacks</h1>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>View, track, and reply to user reports and feedbacks.</p>
                </div>
                
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }}
                        onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
                </div>
            ) : filteredFeedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <MessageSquareText size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>{searchTerm ? 'No matching feedbacks found' : 'No feedbacks yet'}</h3>
                    <p style={{ color: '#64748B' }}>{searchTerm ? 'Try adjusting your search query.' : 'When users submit feedback or reports, they will appear here.'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredFeedbacks.map((f) => (
                        <div key={f.id} style={{
                            backgroundColor: 'white',
                            border: `1px solid ${f.status === 'pending' ? '#FCD34D' : '#E2E8F0'}`,
                            borderLeft: f.status === 'pending' ? '4px solid #F59E0B' : '4px solid #10B981',
                            borderRadius: '0.5rem',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                                            {f.subject}
                                        </h3>
                                        {f.status === 'pending' ? (
                                            <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                Pending Reply
                                            </span>
                                        ) : (
                                            <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                Replied
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', color: '#64748B', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 500, color: '#475569' }}>{f.name}</span>
                                        <span>•</span>
                                        <a href={`mailto:${f.email}`} style={{ color: '#3B82F6', textDecoration: 'none' }}>{f.email}</a>
                                        <span>•</span>
                                        <span>{f.phone}</span>
                                        <span>•</span>
                                        <span>{f.location}</span>
                                        <span>•</span>
                                        <span>{formatDate(f.created_at)}</span>
                                    </div>
                                    <div style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#F1F5F9', borderRadius: '0.25rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                                        Project: {f.project_name} <span style={{ opacity: 0.5, marginLeft: '0.25rem' }}>(ID: {f.id.substring(0, 13)}...)</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {f.status === 'pending' && replyingTo !== f.id && (
                                        <button
                                            onClick={() => setReplyingTo(f.id)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
                                        >
                                            <Reply size={16} />
                                            Reply
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(f.id)}
                                        disabled={isDeleting === f.id}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', backgroundColor: 'white', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: isDeleting === f.id ? 'not-allowed' : 'pointer' }}
                                    >
                                        {isDeleting === f.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: '1rem', color: '#334155', fontSize: '0.9375rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                {f.message}
                            </div>
                            
                            {/* Reply Input Area */}
                            {replyingTo === f.id && (
                                <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', margin: '0 0 0.5rem 0' }}>Write Reply</h4>
                                    <textarea 
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={4}
                                        placeholder="Type your official response to this feedback..."
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem', resize: 'vertical', outline: 'none', marginBottom: '1rem' }}
                                        autoFocus
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                                            disabled={isSubmittingReply}
                                            style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', backgroundColor: 'white', color: '#475569', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => handleReply(f.id)}
                                            disabled={isSubmittingReply || !replyText.trim()}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', backgroundColor: '#3B82F6', color: 'white', fontSize: '0.875rem', cursor: isSubmittingReply || !replyText.trim() ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: (!replyText.trim() || isSubmittingReply) ? 0.7 : 1 }}
                                        >
                                            {isSubmittingReply ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Reply size={16} />}
                                            Send Response
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Existing Reply */}
                            {f.status === 'replied' && f.response && (
                                <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: '0.5rem', border: '1px solid #BBF7D0' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534', margin: '0 0 0.25rem 0' }}>PIB Official Response</h4>
                                    <p style={{ margin: 0, color: '#15803D', fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>{f.response}</p>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#166534', opacity: 0.8 }}>
                                        Sent on {f.responded_at ? formatDate(f.responded_at) : 'Unknown date'}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
