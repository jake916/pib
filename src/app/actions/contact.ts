"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireRole } from './admin'

export type ContactMessage = {
    id: string
    name: string
    email: string
    subject: string | null
    message: string
    is_read: boolean
    created_at: string
}

export async function submitMessage(data: { name: string; email: string; subject?: string; message: string }) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('contact_messages')
        .insert([{
            name: data.name,
            email: data.email,
            subject: data.subject || null,
            message: data.message
        }])

    if (error) {
        throw new Error(`Failed to submit message: ${error.message}`)
    }
}

export async function getMessages() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(`Failed to fetch messages: ${error.message}`)
    }

    return data as ContactMessage[]
}

export async function markAsRead(id: string) {
    await requireRole(['customer_admin', 'administrator']);
    const supabase = await createClient()

    const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to mark as read: ${error.message}`)
    }

    revalidatePath('/admin/contact')
}

export async function deleteMessage(id: string) {
    await requireRole(['customer_admin', 'administrator']);
    const supabase = await createClient()

    const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to delete message: ${error.message}`)
    }

    revalidatePath('/admin/contact')
}
