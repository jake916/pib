import { getCurrentAdminRole, requireRole } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export default async function GovernmentAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Ensure the user is logged in and has the government_admin role (or higher)
    await requireRole(['government_admin', 'administrator']);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = await getCurrentAdminRole();

    const handleSignOut = async () => {
        'use server';
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect('/admin/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            {/* Header */}
            <header style={{ 
                backgroundColor: 'white', 
                borderBottom: '1px solid #E2E8F0', 
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#D72638', letterSpacing: '-0.02em' }}>
                        PIB <span style={{ color: '#1E293B', fontWeight: 600 }}>GOV</span>
                    </div>
                    <nav style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link 
                            href="/government-admin/dashboard" 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                color: '#0F172A', 
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            <LayoutDashboard size={18} />
                            Projects
                        </Link>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', backgroundColor: '#F1F5F9', borderRadius: '2rem' }}>
                        <User size={16} color="#64748B" />
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>
                            {user?.email?.split('@')[0]}
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 400, textTransform: 'uppercase' }}>
                                • {role?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    
                    <form action={handleSignOut}>
                        <button 
                            type="submit"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                background: 'none', 
                                border: 'none', 
                                color: '#64748B', 
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                padding: '0.5rem'
                            }}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </form>
                </div>
            </header>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {children}
            </main>
        </div>
    );
}
