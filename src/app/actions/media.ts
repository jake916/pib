'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireRole } from './admin'

export type Album = {
    id: string
    title: string
    cover_url: string
    created_at: string
}

export type Video = {
    id: string
    title: string
    url: string
    created_at: string
}

export type Photo = {
    id: string
    album_id: string
    title: string | null
    url: string
    is_featured: boolean
    created_at: string
}

export type MediaItem = {
    id: string
    type: 'album' | 'video'
    title: string
    cover: string
    count?: number
    date: string
    videoUrl?: string
}

async function uploadFileToSupabase(file: File, path: string) {
    const supabase = await createClient()

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, { upsert: true })

    if (uploadError) {
        throw new Error('Failed to upload file to storage: ' + uploadError.message)
    }

    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path)

    return publicUrl
}

export async function createAlbum(formData: FormData) {
    await requireRole(['media_admin']);
    const title = formData.get('title') as string
    const coverFile = formData.get('coverFile') as File | null

    if (!title) {
        throw new Error('Album title is required')
    }

    const supabase = await createClient()
    let coverUrl = ''

    if (coverFile && coverFile.size > 0) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        coverUrl = await uploadFileToSupabase(coverFile, fileName)
    }

    const { data, error } = await supabase
        .from('albums')
        .insert({ title, cover_url: coverUrl })
        .select()
        .single()

    if (error) {
        throw new Error('Failed to create album: ' + error.message)
    }

    revalidatePath('/admin/media')
    return data
}

export async function uploadVideo(formData: FormData) {
    await requireRole(['media_admin']);
    const title = formData.get('title') as string
    const videoFile = formData.get('videoFile') as File

    if (!title || !videoFile || videoFile.size === 0) {
        throw new Error('Title and video file are required')
    }

    const fileExt = videoFile.name.split('.').pop()
    const fileName = `videos/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const videoUrl = await uploadFileToSupabase(videoFile, fileName)

    const supabase = await createClient()
    const { data, error } = await supabase
        .from('videos')
        .insert({ title, url: videoUrl })
        .select()
        .single()

    if (error) {
        throw new Error('Failed to create video record: ' + error.message)
    }

    revalidatePath('/admin/media')
    return data
}

export async function getMediaItems(): Promise<MediaItem[]> {
    const supabase = await createClient()

    const [albumsResult, videosResult] = await Promise.all([
        supabase.from('albums').select('*, photos(count)').order('created_at', { ascending: false }),
        supabase.from('videos').select('*').order('created_at', { ascending: false })
    ])

    if (albumsResult.error) throw new Error(albumsResult.error.message)
    if (videosResult.error) throw new Error(videosResult.error.message)

    const albums: MediaItem[] = albumsResult.data.map((a: any) => ({
        id: a.id,
        type: 'album',
        title: a.title,
        cover: a.cover_url || '/placeholder.png',
        count: a.photos?.[0]?.count || 0,
        date: new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }))

    const videos: MediaItem[] = videosResult.data.map((v: any) => ({
        id: v.id,
        type: 'video',
        title: v.title,
        cover: '/video-placeholder.png', // Or generate a thumbnail if possible
        videoUrl: v.url,
        date: new Date(v.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }))

    // Sort combined by date
    return [...albums, ...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getAlbum(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('albums')
        .select('*, photos(*)')
        .eq('id', id)
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function uploadPhotosToAlbum(albumId: string, formData: FormData) {
    await requireRole(['media_admin']);
    const files = formData.getAll('photos') as File[]
    if (!files || files.length === 0) return

    const supabase = await createClient()
    const uploadPromises = files.map(async (file) => {
        if (file.size === 0) return null

        const fileExt = file.name.split('.').pop()
        const fileName = `photos/${albumId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const url = await uploadFileToSupabase(file, fileName)

        return {
            album_id: albumId,
            url,
            title: file.name
        }
    })

    const payload = (await Promise.all(uploadPromises)).filter(Boolean)

    if (payload.length > 0) {
        const { error } = await supabase.from('photos').insert(payload)
        if (error) throw new Error('Failed to insert photos: ' + error.message)
    }

    revalidatePath(`/admin/media/${albumId}`)
    revalidatePath(`/admin/media`)
    return true
}

export async function deleteMediaItem(id: string, type: 'album' | 'video' | 'photo', url?: string) {
    await requireRole(['media_admin']);
    const supabase = await createClient()

    // 1. Delete from storage if we have URL
    if (url) {
        try {
            const urlObj = new URL(url)
            const pathParts = urlObj.pathname.split('/media/')
            if (pathParts.length > 1) {
                const storagePath = pathParts[1]
                await supabase.storage.from('media').remove([storagePath])
            }
        } catch (e) {
            console.error('Failed to parse storage URL for deletion:', e)
        }
    }

    let tableName = ''
    if (type === 'album') tableName = 'albums'
    if (type === 'video') tableName = 'videos'
    if (type === 'photo') tableName = 'photos'

    if (!tableName) return

    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) throw new Error(`Failed to delete ${type}: ` + error.message)

    revalidatePath('/admin/media')
    return true
}

export async function updateMediaItem(id: string, type: 'album' | 'video', formData: FormData) {
    await requireRole(['media_admin']);
    const title = formData.get('title') as string
    const file = formData.get('file') as File | null

    const supabase = await createClient()
    const updateData: any = { title }

    let tableName = type === 'album' ? 'albums' : 'videos'
    let urlField = type === 'album' ? 'cover_url' : 'url'
    let folder = type === 'album' ? 'covers' : 'videos'

    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        updateData[urlField] = await uploadFileToSupabase(file, fileName)
    }

    const { error } = await supabase.from(tableName).update(updateData).eq('id', id)
    if (error) throw new Error(`Failed to update ${type}: ` + error.message)

    revalidatePath('/admin/media')
    return true
}

export type PublicMediaItem = {
    id: string
    type: 'image' | 'video'
    src: string
    title: string
    date: string
}

export async function getPublicMedia(): Promise<PublicMediaItem[]> {
    const supabase = await createClient()

    const [photosResult, videosResult] = await Promise.all([
        supabase.from('photos').select('*').order('created_at', { ascending: false }),
        supabase.from('videos').select('*').order('created_at', { ascending: false })
    ])

    if (photosResult.error) throw new Error(photosResult.error.message)
    if (videosResult.error) throw new Error(videosResult.error.message)

    const photos: PublicMediaItem[] = photosResult.data.map((p: any) => ({
        id: p.id,
        type: 'image',
        src: p.url,
        title: p.title || 'Gallery Photo',
        date: new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    }))

    const videos: PublicMediaItem[] = videosResult.data.map((v: any) => ({
        id: v.id,
        type: 'video',
        src: v.url,
        title: v.title,
        date: new Date(v.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    }))

    // Sort combined by date
    return [...photos, ...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getRandomPhotos(limit: number): Promise<PublicMediaItem[]> {
    const supabase = await createClient()

    const { data: photos, error } = await supabase.from('photos').select('*')

    if (error) throw new Error(error.message)

    // Shuffle and pick
    const shuffled = (photos || [])
        .sort(() => 0.5 - Math.random())
        .slice(0, limit)
        .map((p: any) => ({
            id: p.id,
            type: 'image' as 'image',
            src: p.url,
            title: p.title || 'Gallery Photo',
            date: new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        }))

    return shuffled
}

export async function togglePhotoFeatured(id: string, isFeatured: boolean) {
    await requireRole(['media_admin']);
    const supabase = await createClient()
    const { error } = await supabase
        .from('photos')
        .update({ is_featured: isFeatured })
        .eq('id', id)

    if (error) throw new Error('Failed to update photo featured status: ' + error.message)
    
    // We don't know the album ID here to revalidate, but we can revalidate home
    revalidatePath('/')
    return true
}

export async function getFeaturedPhotos(): Promise<Photo[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })

    if (error) {
        return []
    }
    return data || []
}
