'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { Category } from '@/lib/types'

function slugify(text: string) {
    return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function NuevoProductoPage() {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [priceCents, setPriceCents] = useState('')
    const [stock, setStock] = useState('0')
    const [categoryId, setCategoryId] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.from('categories').select('*').order('name').then(({ data }) => {
            if (data) setCategories(data)
        })
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const price = Math.round(parseFloat(priceCents) * 100)

        if (isNaN(price) || price < 0) {
            toast.error('El precio no es válido')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('products').insert({
            name,
            slug: slug || slugify(name),
            description: description || null,
            price_cents: price,
            stock_qty: parseInt(stock),
            category_id: categoryId || null,
            image_url: imageUrl || null,
            is_active: isActive,
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Producto creado')
            router.push('/admin/productos')
            router.refresh()
        }

        setLoading(false)
    }

    return (
        <div className="max-w-lg">
            <h1 className="text-2xl font-semibold mb-8">Nuevo producto</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={e => { setName(e.target.value); setSlug(slugify(e.target.value)) }}
                        placeholder="iPhone 15"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        placeholder="iphone-15"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Descripción del producto"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <Label htmlFor="price">Precio ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={priceCents}
                            onChange={e => setPriceCents(e.target.value)}
                            placeholder="99.99"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="">Sin categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="imageUrl">URL de imagen</Label>
                    <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        id="isActive"
                        type="checkbox"
                        checked={isActive}
                        onChange={e => setIsActive(e.target.checked)}
                        className="h-4 w-4"
                    />
                    <Label htmlFor="isActive">Producto activo</Label>
                </div>
                <div className="flex gap-2 mt-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Crear producto'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    )
}