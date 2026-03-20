import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Admin credentials - change these after first login
const ADMIN_EMAIL = 'admin@pib.gov.ng'
const ADMIN_PASSWORD = 'Admin@123'

async function seedAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Error: Supabase credentials not found in environment variables')
        console.error('Make sure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
        process.exit(1)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('🌱 Seeding admin user...')
    console.log('📧 Email:', ADMIN_EMAIL)
    console.log('🔑 Password:', ADMIN_PASSWORD)
    console.log('')

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
                console.log('⚠️  Admin user already exists!')
                console.log('📧 Email:', ADMIN_EMAIL)
                console.log('🔑 Password:', ADMIN_PASSWORD)
                console.log('')
                console.log('✅ You can use these credentials to log in at http://localhost:3000/admin/login')
            } else {
                console.error('❌ Error creating admin user:', error.message)
                process.exit(1)
            }
        } else {
            console.log('✅ Admin user created successfully!')
            console.log('')
            console.log('📧 Email:', ADMIN_EMAIL)
            console.log('🔑 Password:', ADMIN_PASSWORD)
            console.log('')
            console.log('🎉 You can now log in at http://localhost:3000/admin/login')
            console.log('')
            console.log('⚠️  IMPORTANT: Change your password after first login!')
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err)
        process.exit(1)
    }
}

seedAdmin()
