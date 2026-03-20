'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireRole } from './admin'

export type BlogPost = {
    id: string
    slug: string
    title: string
    content: string
    excerpt: string
    author: string // Keeping for backward compat/display
    author_id?: string | null
    cover_url: string | null
    category: string // Keeping for backward compat/display
    category_id?: string | null
    read_time: string | null
    published: boolean
    published_at?: string | null
    created_at: string
}

export type BlogCategory = {
    id: string
    name: string
    slug: string
    created_at: string
}

export type BlogAuthor = {
    id: string
    name: string
    role: string | null
    avatar_url: string | null
    created_at: string
}

export async function getPosts(options?: { publishedOnly?: boolean }): Promise<BlogPost[]> {
    const supabase = await createClient()

    let query = supabase.from('posts').select('*').order('created_at', { ascending: false })

    if (options?.publishedOnly) {
        query = query.eq('published', true).lte('published_at', new Date().toISOString())
    }

    const { data, error } = await query

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(error.message)
    }

    return data
}

export async function getPostById(id: string): Promise<BlogPost | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(error.message)
    }

    return data
}

export async function createPost(postData: Partial<BlogPost>, coverFile?: File): Promise<string> {
    await requireRole(['blog_admin', 'administrator']);
    const supabase = await createClient()

    // Process image upload
    let cover_url = postData.cover_url || null

    if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `covers/${fileName}`

        const { error: uploadError, data } = await supabase.storage
            .from('media')
            .upload(filePath, coverFile)

        if (uploadError) {
            throw new Error(`Failed to upload cover: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath)

        cover_url = publicUrl
    }

    // Insert post
    const { data, error } = await supabase
        .from('posts')
        .insert([{
            slug: postData.slug,
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt,
            author: postData.author,
            author_id: postData.author_id,
            category: postData.category,
            category_id: postData.category_id,
            read_time: postData.read_time,
            published: postData.published || false,
            published_at: postData.published_at,
            cover_url: cover_url,
        }])
        .select()
        .single()

    if (error) {
        throw new Error(`Failed to create post: ${error.message}`)
    }

    revalidatePath('/admin/blog')
    revalidatePath('/blog')

    return data.id
}

export async function updatePost(id: string, postData: Partial<BlogPost>, coverFile?: File | null): Promise<boolean> {
    await requireRole(['blog_admin', 'administrator']);
    const supabase = await createClient()

    let cover_url = postData.cover_url

    // Process new image upload if provided
    if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `covers/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, coverFile)

        if (uploadError) {
            throw new Error(`Failed to upload new cover: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath)

        cover_url = publicUrl
    }

    const { error } = await supabase
        .from('posts')
        .update({
            ...postData,
            cover_url: cover_url !== undefined ? cover_url : undefined,
            category_id: postData.category_id,
            author_id: postData.author_id,
            published_at: postData.published_at !== undefined ? postData.published_at : undefined
        })
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to update post: ${error.message}`)
    }

    revalidatePath('/admin/blog')
    revalidatePath('/admin/blog/' + id)
    if (postData.slug) revalidatePath('/blog/' + postData.slug)
    revalidatePath('/blog')

    return true
}

export async function deletePost(id: string, coverUrl?: string | null): Promise<boolean> {
    await requireRole(['blog_admin', 'administrator']);
    const supabase = await createClient()

    // 1. Delete associated cover image from storage if it exists
    if (coverUrl && coverUrl.includes('/storage/v1/object/public/media/')) {
        try {
            const urlPath = coverUrl.split('/storage/v1/object/public/media/')[1]
            if (urlPath) {
                const { error: storageError } = await supabase.storage
                    .from('media')
                    .remove([urlPath])

                if (storageError) {
                    console.error('Failed to delete blog cover from storage:', storageError)
                }
            }
        } catch (err) {
            console.error('Error parsing cover URL for deletion', err)
        }
    }

    // 2. Delete the record from DB
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to delete post: ${error.message}`)
    }

    revalidatePath('/admin/blog')
    revalidatePath('/blog')

    return true
}

// --- Category Actions ---

export async function getCategories(): Promise<BlogCategory[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
}

export async function createCategory(name: string, slug: string): Promise<BlogCategory> {
    await requireRole(['blog_admin', 'administrator']);
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('blog_categories')
        .insert([{ name, slug }])
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/admin/blog')
    return data
}

export async function deleteCategory(id: string): Promise<void> {
    await requireRole(['blog_admin', 'administrator']);
    const supabase = await createClient()
    const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/blog')
}

// --- Author Actions ---

export async function getAuthors(): Promise<BlogAuthor[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
}

export async function createAuthor(authorData: Partial<BlogAuthor>): Promise<BlogAuthor> {
    await requireRole(['blog_admin', 'administrator']);
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('blog_authors')
        .insert([authorData])
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/admin/blog')
    return data
}

export async function deleteAuthor(id: string): Promise<void> {
    revalidatePath('/admin/blog')
}
