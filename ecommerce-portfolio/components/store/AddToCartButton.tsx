'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/CartStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

export function AddToCartButton({ product }: { product: Product }) {
    const { addItem } = useCartStore()
    const router = useRouter()
    const outOfStock = product.stock_qty === 0

    async function handleAdd() {
        const supabase = (await import('@/lib/supabase/client')).createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error('Tenés que iniciar sesión para agregar productos')
            router.push('/auth')
            return
        }

        await addItem(product.id)
        toast.success('Producto agregado al carrito')
    }

    return (
        <Button
            size="lg"
            variant="accent"
            disabled={outOfStock}
            className="w-full md:w-auto"
            onClick={handleAdd}
        >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
    )
}