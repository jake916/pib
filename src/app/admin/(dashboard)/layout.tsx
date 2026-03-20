import AdminSidebar from "@/components/AdminSidebar";
import { Toaster } from 'sonner';
import { getCurrentAdminRole } from "@/app/actions/admin";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getCurrentAdminRole();
    
    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar userRole={role} />
            <main style={{ flex: 1, marginLeft: '250px', padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                {children}
            </main>
            <Toaster position="top-right" />
        </div>
    );
}
