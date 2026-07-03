'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function EditarCategoriaPage() {
    const { id } = useParams<{ id: string }>()
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.from('categories').select('*').eq('id', id).single().then(({ data }) => {
            if (data) {
                setName(data.name)
                setSlug(data.slug)
                setDescription(data.description ?? '')
            }
            setFetching(false)
        })
    }, [id])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.from('categories').update({
            name,
            slug,
            description: description || null,
            updated_at: new Date().toISOString(),
        }).eq('id', id)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Categoría actualizada')
            router.push('/admin/categorias')
            router.refresh()
        }

        setLoading(false)
    }

    if (fetching) return <p className="text-muted-foreground">Cargando...</p>

    return (
        <div className="max-w-lg">
            <h1 className="text-2xl font-semibold mb-8">Editar categoría</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Descripción (opcional)</Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    )
}