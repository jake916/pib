import AdminSidebar from "@/components/AdminSidebar";
import { getCurrentAdminRole } from "@/app/actions/admin";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getCurrentAdminRole();
    
    if (role === 'government_admin') {
        redirect('/government-admin/dashboard');
    }
    
    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar userRole={role} />
            <main style={{ flex: 1, marginLeft: '250px', padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
}
