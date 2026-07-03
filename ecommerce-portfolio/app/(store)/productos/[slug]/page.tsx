import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/store/AddToCartButton'

export default async function ProductoPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (!product) notFound()

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Imagen */}
                <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                    {product.categories && (
                        <Badge variant="secondary" className="w-fit">
                            {(product.categories as any).name}
                        </Badge>
                    )}
                    <h1 className="text-3xl font-semibold">{product.name}</h1>
                    {product.description && (
                        <p className="text-muted-foreground">{product.description}</p>
                    )}
                    <p className="text-3xl font-bold">
                        ${(product.price_cents / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {product.stock_qty > 0
                            ? `${product.stock_qty} unidades disponibles`
                            : 'Sin stock'}
                    </p>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    )
}