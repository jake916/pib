import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json(
            { error: 'Supabase credentials not configured' },
            { status: 500 }
        )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const ADMIN_EMAIL = 'admin@pib.gov.ng'
    const ADMIN_PASSWORD = 'Admin@123'

    try {
        const { data, error } = await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            options: {
                data: {
                    role: 'admin'
                }
            }
        })

        if (error) {
            if (error.message.includes('already registered')) {
                return NextResponse.json({
                    success: true,
                    message: 'Admin user already exists',
                    credentials: {
                        email: ADMIN_EMAIL,
                        password: ADMIN_PASSWORD
                    }
                })
            }
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            credentials: {
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            }
        })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Unexpected error occurred' },
            { status: 500 }
        )
    }
}
