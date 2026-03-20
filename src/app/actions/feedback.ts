"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireRole } from './admin'

export type Feedback = {
    id: string
    name: string
    email: string
    phone: string
    location: string
    project: string
    project_name: string
    subject: string
    message: string
    status: 'pending' | 'replied'
    response: string | null
    responded_at: string | null
    created_at: string
}

export async function submitFeedback(data: {
    name: string
    email: string
    phone: string
    location: string
    project: string
    project_name: string
    subject: string
    message: string
}) {
    const supabase = await createClient()

    const { data: result, error } = await supabase
        .from('feedbacks')
        .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone,
            location: data.location,
            project: data.project,
            project_name: data.project_name,
            subject: data.subject,
            message: data.message,
            status: 'pending'
        }])
        .select()
        .single()

    if (error) {
        throw new Error(`Failed to submit feedback: ${error.message}`)
    }

    revalidatePath('/reports')
    return result
}

export async function getFeedbacksByContact(contactInfo: string) {
    const supabase = await createClient()
    const isEmail = contactInfo.includes('@')
    
    let query = supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })

    if (isEmail) {
        query = query.ilike('email', contactInfo.trim())
    } else {
        // Simple numeric extraction to match the user's phone search behavior
        query = query.like('phone', `%${contactInfo.replace(/\D/g, '')}%`)
    }

    const { data, error } = await query

    if (error) {
        throw new Error(`Failed to fetch feedbacks: ${error.message}`)
    }

    return data as Feedback[]
}

export async function getFeedbackById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw new Error(`Failed to fetch feedback: ${error.message}`)
    }

    return data as Feedback
}

export async function getAllFeedbacks() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(`Failed to fetch feedbacks: ${error.message}`)
    }

    return data as Feedback[]
}

export async function replyToFeedback(id: string, responseText: string) {
    await requireRole(['customer_admin', 'administrator'])
    const supabase = await createClient()

    const { error } = await supabase
        .from('feedbacks')
        .update({
            status: 'replied',
            response: responseText,
            responded_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to reply to feedback: ${error.message}`)
    }

    revalidatePath('/admin/feedbacks')
    revalidatePath(`/reports/${id}`)
    revalidatePath('/reports')
}

export async function deleteFeedback(id: string) {
    await requireRole(['customer_admin', 'administrator'])
    const supabase = await createClient()

    const { error } = await supabase
        .from('feedbacks')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to delete feedback: ${error.message}`)
    }

    revalidatePath('/admin/feedbacks')
}
