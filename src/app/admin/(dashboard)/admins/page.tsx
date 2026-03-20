'use client';

import { useEffect, useState } from 'react';
import { getAdmins, createAdmin, updateAdminRole, resetAdminPassword, deleteAdmin, updateAdminDetails } from '@/app/actions/admin';
import { UserPlus, Shield, ShieldAlert, Key, Trash2, Edit2, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminsPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal forms states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState<string | null>(null);
    const [editAdminDoc, setEditAdminDoc] = useState<any | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add Form State
    const [addForm, setAddForm] = useState({ name: '', email: '', role: 'administrator', password: '' });

    // Reset Password State
    const [newPassword, setNewPassword] = useState('');

    const loadAdmins = async () => {
        try {
            setIsLoading(true);
            const data = await getAdmins();
            setAdmins(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch admins.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await createAdmin(addForm.name, addForm.email, addForm.role, addForm.password);
            toast.success("Admin created successfully!");
            setShowAddModal(false);
            setAddForm({ name: '', email: '', role: 'administrator', password: '' });
            await loadAdmins();
        } catch (error: any) {
            toast.error(error.message || "Failed to create admin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            toast.info("Updating role...");
            await updateAdminRole(id, newRole);
            toast.success("Role updated successfully.");
            setAdmins(admins.map(a => a.id === id ? { ...a, role: newRole } : a));
        } catch (error: any) {
            toast.error(error.message || "Failed to update role.");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showResetModal) return;
        try {
            setIsSubmitting(true);
            await resetAdminPassword(showResetModal, newPassword);
            toast.success("Password reset securely.");
            setShowResetModal(null);
            setNewPassword('');
        } catch (error: any) {
            toast.error(error.message || "Failed to reset password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editAdminDoc) return;
        try {
            setIsSubmitting(true);
            await updateAdminDetails(editAdminDoc.id, editAdminDoc.name, editAdminDoc.email);
            toast.success("Admin details updated successfully.");
            setEditAdminDoc(null);
            
            // Optimistically update local state instead of doing a full reload
            setAdmins(admins.map(a => a.id === editAdminDoc.id ? { ...a, name: editAdminDoc.name, email: editAdminDoc.email } : a));
        } catch (error: any) {
            toast.error(error.message || "Failed to update admin details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you incredibly sure you want to completely erase this user's administrative access? This cannot be undone.")) return;
        try {
            await deleteAdmin(id);
            toast.success("Administrator successfully removed.");
            setAdmins(admins.filter(a => a.id !== id));
        } catch (error: any) {
            toast.error(error.message || "Failed to remove administrator.");
        }
    };

    const filteredAdmins = admins.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>Administrators</h1>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Manage the team and set strict Role-Based access limits securely.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '250px' }}>
                        <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={16} />
                        <input 
                            type="text" 
                            placeholder="Search admins..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            backgroundColor: '#0F172A', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
                        }}
                    >
                        <UserPlus size={16} />
                        Add New Admin
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
                </div>
            ) : filteredAdmins.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <ShieldAlert size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>No administrators found</h3>
                    <p style={{ color: '#64748B' }}>If you are testing locally, ensure you have populated the admin_roles database using SQL.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Administrator Name</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Email Address</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Current Role</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Date Added</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: '#1E293B' }}>{admin.name}</td>
                                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.875rem' }}>{admin.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <select 
                                            value={admin.role}
                                            onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                                            style={{
                                                padding: '0.375rem 0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: admin.role === 'administrator' ? '#EFF6FF' : '#F8FAFC', color: admin.role === 'administrator' ? '#1D4ED8' : '#334155', fontWeight: 500, outline: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            <option value="administrator">Supreme Administrator</option>
                                            <option value="project_admin">Project Admin</option>
                                            <option value="media_admin">Media Admin</option>
                                            <option value="blog_admin">Blog Admin</option>
                                            <option value="customer_admin">Customer Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.875rem' }}>
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setEditAdminDoc({ id: admin.id, name: admin.name, email: admin.email })}
                                                style={{ padding: '0.375rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#475569', backgroundColor: 'transparent', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => setShowResetModal(admin.id)}
                                                style={{ padding: '0.375rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#475569', backgroundColor: 'transparent', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}
                                            >
                                                <Key size={14} /> Password
                                            </button>
                                            <button
                                                onClick={() => handleDelete(admin.id)}
                                                style={{ padding: '0.375rem', color: '#EF4444', backgroundColor: 'transparent', border: '1px solid #FECACA', borderRadius: '0.375rem', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals Overlay */}
            {(showAddModal || showResetModal || !!editAdminDoc) && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {/* Add Admin Modal */}
                    {showAddModal && (
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Shield size={24} color="#0F172A" />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>Register New Admin</h2>
                            </div>
                            <form onSubmit={handleCreateAdmin}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>Full Name</label>
                                    <input type="text" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} required style={{ width: '100%', padding: '0.625rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', outline: 'none' }} placeholder="Jane Doe" />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>Email Address</label>
                                    <input type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} required style={{ width: '100%', padding: '0.625rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', outline: 'none' }} placeholder="admin@pib.gov.ng" />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>Initial Password</label>
                                    <input type="password" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} required minLength={6} style={{ width: '100%', padding: '0.625rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', outline: 'none' }} placeholder="••••••••" />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>Security Role</label>
                                    <select value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})} style={{ width: '100%', padding: '0.625rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', outline: 'none', backgroundColor: 'white' }}>
                                        <option value="administrator">Supreme Administrator</option>
                                        <option value="project_admin">Project Admin</option>
                                        <option value="media_admin">Media Admin</option>
                                        <option value="blog_admin">Blog Admin</option>
                                        <option value="customer_admin">Customer Admin</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.625rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', backgroundColor: 'white', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={isSubmitting} style={{ padding: '0.625rem 1rem', border: 'none', borderRadius: '0.375rem', backgroundColor: '#0F172A', color: 'white', fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isSubmitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />} Create Access
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Reset Password Modal */}
                    {showResetModal && (
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Key size={24} color="#0F172A" />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>Reset Admin Password</h2>
                            </div>
                            <form onSubmit={handleResetPassword}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>New Administrative Password</label>
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: '0.625rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', outline: 'none' }} placeholder="••••••••" autoFocus />
                                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>Forces an immediate bypass of their previous credentials. Use securely.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowResetModal(null)} style={{ padding: '0.625rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', backgroundColor: 'white', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={isSubmitting} style={{ padding: '0.625rem 1rem', border: 'none', borderRadius: '0.375rem', backgroundColor: '#EF4444', color: 'white', fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isSubmitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />} Ensure Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {/* Edit Admin Modal */}
                    {!!editAdminDoc && (
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Edit2 size={24} color="#0F172A" />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>Edit Admin Details</h2>
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>Full Name</label>
                                    <input type="text" value={editAdminDoc.name} onChange={e => setEditAdminDoc({...editAdminDoc, name: e.target.value})} required style={{ width: '100%', padding: '0.625rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', outline: 'none' }} placeholder="Jane Doe" />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>Email Address</label>
                                    <input type="email" value={editAdminDoc.email} onChange={e => setEditAdminDoc({...editAdminDoc, email: e.target.value})} required style={{ width: '100%', padding: '0.625rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', outline: 'none' }} placeholder="admin@pib.gov.ng" />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setEditAdminDoc(null)} style={{ padding: '0.625rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', backgroundColor: 'white', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={isSubmitting} style={{ padding: '0.625rem 1rem', border: 'none', borderRadius: '0.375rem', backgroundColor: '#0F172A', color: 'white', fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isSubmitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />} Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
