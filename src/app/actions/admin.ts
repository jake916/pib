'use server';

import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to create an admin-level Supabase client that bypasses RLS
function getAdminSupabaseClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.");
    }
    
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}

// Helper to bootstrap the system if and only if the admin_roles table is completely empty
async function ensureBootstrapAdmin(supabaseUserClient: any, user: any) {
    const adminSupabase = getAdminSupabaseClient();
    const { count, error } = await adminSupabase
        .from('admin_roles')
        .select('*', { count: 'exact', head: true });
        
    if (error && error.code === '42P01') {
        throw new Error("Database error: The 'admin_roles' table does not exist. Please run the SQL setup script to create it.");
    }
        
    if (count === 0) {
        try {
            await adminSupabase.from('admin_roles').insert({
                id: user.id,
                email: user.email || '',
                name: user.email?.split('@')[0] || 'System Admin',
                role: 'administrator'
            });
            return { role: 'administrator' };
        } catch (e) {
            console.error("Failed to bootstrap admin:", e);
        }
    }
    return null;
}

// Ensure the caller is an active administrator
export async function requireAdministrator() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");
    
    // Default the first setup user config
    let { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('id', user.id)
        .single();
        
    if (!adminRole) {
        adminRole = await ensureBootstrapAdmin(supabase, user);
    }
        
    if (!adminRole || adminRole.role !== 'administrator') {
        throw new Error("Forbidden: This action requires full Administrator privileges.");
    }
    
    return user;
}

// Get the current user's role
export async function getCurrentAdminRole() {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;
        
        let { data: adminRole } = await supabase
            .from('admin_roles')
            .select('role')
            .eq('id', user.id)
            .single();
            
        if (!adminRole) {
            adminRole = await ensureBootstrapAdmin(supabase, user);
        }
            
        return adminRole?.role || null;
    } catch {
        return null;
    }
}

// Get all admins
export async function getAdmins() {
    await requireAdministrator();
    
    const adminSupabase = getAdminSupabaseClient();
    
    const { data: roles, error } = await adminSupabase
        .from('admin_roles')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) throw new Error(error.message);
    return roles;
}

// Create new admin
export async function createAdmin(name: string, email: string, role: string, password: string) {
    await requireAdministrator();
    
    const adminSupabase = getAdminSupabaseClient();
    
    // 1. Create the user in Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true // Auto-confirm the email
    });
    
    if (authError || !authData.user) {
        throw new Error(authError?.message || "Failed to create authentication user.");
    }
    
    // 2. Insert into roles table
    const { error: dbError } = await adminSupabase
        .from('admin_roles')
        .insert({
            id: authData.user.id,
            email: email.toLowerCase(),
            name,
            role
        });
        
    if (dbError) {
        // Rollback created user
        await adminSupabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(dbError.message);
    }
    
    revalidatePath('/admin/admins');
    return authData.user;
}

// Update admin role
export async function updateAdminRole(id: string, role: string) {
    const caller = await requireAdministrator();
    if (caller.id === id) throw new Error("You cannot change your own role.");
    
    const adminSupabase = getAdminSupabaseClient();
    
    const { error } = await adminSupabase
        .from('admin_roles')
        .update({ role })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
    revalidatePath('/admin/admins');
}

// Update admin details
export async function updateAdminDetails(id: string, name: string, email: string) {
    await requireAdministrator();
    
    const adminSupabase = getAdminSupabaseClient();
    
    // 1. Update auth.users email using Admin API
    const { error: authError } = await adminSupabase.auth.admin.updateUserById(id, {
        email,
        email_confirm: true // Force confirm so they aren't locked out
    });
    
    if (authError) throw new Error(`Auth Error: ${authError.message}`);
    
    // 2. Update role details
    const { error: dbError } = await adminSupabase
        .from('admin_roles')
        .update({ name, email: email.toLowerCase() })
        .eq('id', id);
        
    if (dbError) throw new Error(`Database Error: ${dbError.message}`);
    
    revalidatePath('/admin/admins');
}

// Delete admin
export async function deleteAdmin(id: string) {
    const caller = await requireAdministrator();
    if (caller.id === id) throw new Error("You cannot delete yourself.");

    const adminSupabase = getAdminSupabaseClient();
    
    // Deleting from Auth will cascade to admin_roles if foreign keys are set properly
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(id);
    
    if (authError) throw new Error(authError.message);
    revalidatePath('/admin/admins');
}

// Reset password
export async function resetAdminPassword(id: string, newPassword: string) {
    await requireAdministrator();
    
    const adminSupabase = getAdminSupabaseClient();
    
    const { error } = await adminSupabase.auth.admin.updateUserById(id, {
        password: newPassword
    });
    
    if (error) throw new Error(error.message);
}

// Ensure the caller holds one of the allowed roles
export async function requireRole(allowedRoles: string[]) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");
    
    let { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('id', user.id)
        .single();
        
    if (!adminRole) {
        adminRole = await ensureBootstrapAdmin(supabase, user);
    }
        
    const role = adminRole?.role || 'none';
    
    if (role === 'administrator') return user; // Admins override everything
    if (!allowedRoles.includes(role)) {
        throw new Error(`Forbidden: This action requires one of the following roles: ${allowedRoles.join(', ')}`);
    }
    
    return user;
}
