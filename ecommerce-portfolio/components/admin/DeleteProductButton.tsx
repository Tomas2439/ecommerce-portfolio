'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DeleteProductButton({ id }: { id: string }) {
    const router = useRouter()
    const supabase = createClient()

    async function handleDelete() {
        if (!confirm('¿Seguro que querés eliminar este producto?')) return

        const { error } = await supabase.from('products').delete().eq('id', id)

        if (error) {
            toast.error('Error al eliminar el producto')
        } else {
            toast.success('Producto eliminado')
            router.refresh()
        }
    }

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
            Eliminar
        </Button>
    )
}