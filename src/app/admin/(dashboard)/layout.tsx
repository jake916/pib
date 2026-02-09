import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar />
            <main style={{ flex: 1, marginLeft: '250px', padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
}
