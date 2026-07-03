import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/store/ProductCard'

export default async function ProductosPage() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Productos</h1>
            {products?.length === 0 ? (
                <p className="text-muted-foreground">No hay productos disponibles.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products?.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}