'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireRole } from './admin'
import { syncProjectMediaAlbum, deleteProjectMediaAlbum } from './media'

export type Project = {
    id: string;
    title: string;
    lga: string;
    status: 'Ongoing' | 'Completed' | 'Planned';
    category: string;
    description: string;
    start_date: string;
    completion_date?: string | null;
    show_completion_date?: boolean;
    images: string[];
    is_accessible_to_gov: boolean;
    smartsheet_link?: string | null;
    created_at?: string;
}

export type Category = {
    id: string;
    name: string;
    created_at?: string;
}

const FALLBACK_CATEGORIES: Category[] = [
    { id: 'f1', name: 'Health' },
    { id: 'f2', name: 'Basic and Secondary Education' },
    { id: 'f3', name: 'Tertiary Education' },
    { id: 'f4', name: 'Roads' },
    { id: 'f5', name: 'Transport' },
    { id: 'f6', name: 'Water' },
    { id: 'f7', name: 'Power' }
];

// ... existing uploadFileToSupabase ...

export async function getCategories() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.from('project_categories').select('*').order('name', { ascending: true })
        
        if (error) {
            console.warn('[getCategories] Supabase error:', error.message);
            return FALLBACK_CATEGORIES;
        }
        
        if (!data || data.length === 0) {
            console.info('[getCategories] No categories found in DB, using fallbacks.');
            return FALLBACK_CATEGORIES;
        }
        
        return data as Category[]
    } catch (e) {
        console.error('[getCategories] Critical fetch error:', e);
        return FALLBACK_CATEGORIES;
    }
}

export async function createCategory(name: string) {
    try {
        await requireRole(['project_admin', 'administrator'])
        const supabase = await createClient()
        const { data, error } = await supabase.from('project_categories').insert([{ name }]).select().single()
        if (error) throw new Error(`Failed to create category: ${error.message}`)
        revalidatePath('/admin/projects')
        return { success: true, data: data as Category }
    } catch (e: any) {
        return { success: false, error: e.message || 'Failed to create category' }
    }
}

export async function deleteCategory(id: string) {
    try {
        await requireRole(['project_admin', 'administrator'])

        // If deleting a mock fallback category (e.g. f1, f2) that isn't stored in DB
        if (id.startsWith('f')) {
            return { success: true }
        }

        const supabase = await createClient()
        const { error } = await supabase.from('project_categories').delete().eq('id', id)
        if (error) throw new Error(`Failed to delete category: ${error.message}`)
        revalidatePath('/admin/projects')
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message || 'Failed to delete category' }
    }
}

export async function updateCategory(id: string, name: string) {
    try {
        await requireRole(['project_admin', 'administrator'])

        if (id.startsWith('f')) {
            return createCategory(name)
        }

        const supabase = await createClient()
        const { error } = await supabase.from('project_categories').update({ name }).eq('id', id)
        if (error) throw new Error(`Failed to update category: ${error.message}`)
        revalidatePath('/admin/projects')
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message || 'Failed to update category' }
    }
}

async function uploadFileToSupabase(file: File, path: string) {
    try {
        const supabase = await createClient()

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(path, file, { upsert: true })

        if (uploadError) {
            // If the error is 'fetch failed', it's usually a network issue or missing bucket
            if (uploadError.message === 'fetch failed') {
                throw new Error('Network error: Could not reach Supabase storage. Please check your internet and ensure the "media" bucket exists.')
            }
            throw new Error('Failed to upload file to storage: ' + uploadError.message)
        }

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(uploadData.path)

        return publicUrl
    } catch (e: any) {
        if (e.message.includes('fetch failed')) {
            throw new Error('Network timeout: The file upload took too long. Please try a smaller image or check your connection.')
        }
        throw e
    }
}

export async function getProjects() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            // Handle cases where the table doesn't exist yet
            if (error.code === '42P01' || error.message.includes('schema cache')) {
                console.warn('Projects table not found in database. Returning empty list.');
                return [];
            }
            console.error('[getProjects] Supabase error:', error.message);
            return [];
        }

        return (data as Project[]).map(p => ({
            ...p,
            images: p.images || []
        }))
    } catch (e) {
        console.error('[getProjects] Critical fetch error:', e);
        return [];
    }
}

export async function getGovAccessibleProjects() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('is_accessible_to_gov', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[getGovAccessibleProjects] Supabase error:', error.message);
            return [];
        }

        return (data as Project[]).map(p => ({
            ...p,
            images: p.images || []
        }))
    } catch (e) {
        console.error('[getGovAccessibleProjects] Critical fetch error:', e);
        return [];
    }
}

export async function getProject(id: string) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('[getProject] Supabase error:', error.message);
            return null;
        }

        const project = data as Project;
        return {
            ...project,
            images: project.images || []
        }
    } catch (e) {
        console.error('[getProject] Critical fetch error:', e);
        return null;
    }
}

export async function createProject(formData: FormData) {
    await requireRole(['project_admin', 'administrator'])
    const supabase = await createClient()

    const title = formData.get('title') as string
    const lga = formData.get('lga') as string
    const status = formData.get('status') as any
    const category = formData.get('category') as any
    const description = formData.get('description') as string
    const startDate = formData.get('startDate') as string
    const completionDate = formData.get('completionDate') as string || null
    const showCompletionDate = formData.get('showCompletionDate') === 'true'
    const imageFiles = formData.getAll('images') as File[]

    const imageUrls: string[] = []
    // Limit to 7 images
    const filesToUpload = imageFiles.slice(0, 7)
    
    for (const file of filesToUpload) {
        if (file.size > 0) {
            const fileExt = file.name.split('.').pop()
            const fileName = `projects/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const url = await uploadFileToSupabase(file, fileName)
            imageUrls.push(url)
        }
    }

    const addToMedia = formData.get('addToMedia') === 'true'

    const { data, error } = await supabase
        .from('projects')
        .insert([{
            title,
            lga,
            status,
            category,
            description,
            start_date: startDate,
            completion_date: completionDate,
            show_completion_date: showCompletionDate,
            images: imageUrls,
            is_accessible_to_gov: formData.get('isAccessibleToGov') === 'true',
            smartsheet_link: formData.get('smartsheetLink') as string || null
        }])
        .select()
        .single()

    if (error) {
        throw new Error(`Failed to create project: ${error.message}`)
    }

    if (addToMedia && data?.id) {
        await syncProjectMediaAlbum(data.id, title, imageUrls)
    }

    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    return data
}

export async function updateProject(id: string, formData: FormData) {
    await requireRole(['project_admin', 'administrator'])
    const supabase = await createClient()

    const title = formData.get('title') as string
    const lga = formData.get('lga') as string
    const status = formData.get('status') as any
    const category = formData.get('category') as any
    const description = formData.get('description') as string
    const startDate = formData.get('startDate') as string
    const completionDate = formData.get('completionDate') as string || null
    const showCompletionDate = formData.get('showCompletionDate') === 'true'
    const imageFiles = formData.getAll('images') as File[]
    const existingImages = formData.get('existingImages') ? JSON.parse(formData.get('existingImages') as string) : []
    const addToMedia = formData.get('addToMedia') === 'true'

    const imageUrls: string[] = [...existingImages]
    
    // Total limit of 7
    const remainingSlots = 7 - imageUrls.length
    const filesToUpload = imageFiles.slice(0, Math.max(0, remainingSlots))

    for (const file of filesToUpload) {
        if (file.size > 0) {
            const fileExt = file.name.split('.').pop()
            const fileName = `projects/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const url = await uploadFileToSupabase(file, fileName)
            imageUrls.push(url)
        }
    }

    const { error } = await supabase
        .from('projects')
        .update({
            title,
            lga,
            status,
            category,
            description,
            start_date: startDate,
            completion_date: completionDate,
            show_completion_date: showCompletionDate,
            images: imageUrls,
            is_accessible_to_gov: formData.get('isAccessibleToGov') === 'true',
            smartsheet_link: formData.get('smartsheetLink') as string || null
        })
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to update project: ${error.message}`)
    }

    if (addToMedia) {
        await syncProjectMediaAlbum(id, title, imageUrls)
    } else {
        await deleteProjectMediaAlbum(id)
    }

    revalidatePath('/projects')
    revalidatePath('/admin/projects')
}

export async function deleteProject(id: string) {
    await requireRole(['project_admin', 'administrator'])
    const supabase = await createClient()

    await deleteProjectMediaAlbum(id)

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to delete project: ${error.message}`)
    }

    revalidatePath('/projects')
    revalidatePath('/admin/projects')
}

