import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = await createClient()

    // Sign out the user
    await supabase.auth.signOut()

    // Redirect to login page
    return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'))
}
