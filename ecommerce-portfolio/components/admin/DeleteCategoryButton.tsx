'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DeleteCategoryButton({ id }: { id: string }) {
    const router = useRouter()
    const supabase = createClient()

    async function handleDelete() {
        if (!confirm('¿Seguro que querés eliminar esta categoría?')) return

        const { error } = await supabase.from('categories').delete().eq('id', id)

        if (error) {
            toast.error('Error al eliminar la categoría')
        } else {
            toast.success('Categoría eliminada')
            router.refresh()
        }
    }

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
            Eliminar
        </Button>
    )
}