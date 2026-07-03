'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { OrderStatus } from '@/lib/types'

export function UpdateOrderStatus({
    id,
    currentStatus,
}: {
    id: string
    currentStatus: OrderStatus
}) {
    const router = useRouter()
    const supabase = createClient()

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value as OrderStatus

        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            toast.error('Error al actualizar el estado')
        } else {
            toast.success('Estado actualizado')
            router.refresh()
        }
    }

    return (
        <select
            value={currentStatus}
            onChange={handleChange}
            className="text-sm border rounded-md px-2 py-1 bg-background"
        >
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
        </select>
    )
}