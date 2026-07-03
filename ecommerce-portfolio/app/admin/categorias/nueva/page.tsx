'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

function slugify(text: string) {
    return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function NuevaCategoriaPage() {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.from('categories').insert({
            name,
            slug: slug || slugify(name),
            description: description || null,
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Categoría creada')
            router.push('/admin/categorias')
            router.refresh()
        }

        setLoading(false)
    }

    return (
        <div className="max-w-lg">
            <h1 className="text-2xl font-semibold mb-8">Nueva categoría</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={e => {
                            setName(e.target.value)
                            setSlug(slugify(e.target.value))
                        }}
                        placeholder="Electrónica"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        placeholder="electronica"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Descripción (opcional)</Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Descripción de la categoría"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Crear categoría'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    )
}