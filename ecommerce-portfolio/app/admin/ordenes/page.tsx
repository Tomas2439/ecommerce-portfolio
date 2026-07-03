import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { UpdateOrderStatus } from '@/components/admin/UpdateOrderStatus'

export default async function OrdenesAdminPage() {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name))')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error órdenes:', error)
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-8">Órdenes</h1>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium">ID</th>
                            <th className="text-left px-4 py-3 font-medium">Cliente</th>
                            <th className="text-left px-4 py-3 font-medium">Productos</th>
                            <th className="text-left px-4 py-3 font-medium">Total</th>
                            <th className="text-left px-4 py-3 font-medium">Fecha</th>
                            <th className="text-left px-4 py-3 font-medium">Estado</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!orders?.length && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                    No hay órdenes todavía
                                </td>
                            </tr>
                        )}
                        {orders?.map(order => (
                            <tr key={order.id} className="border-t">
                                <td className="px-4 py-3 font-mono text-muted-foreground">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium">{order.shipping_name}</p>
                                    <p className="text-xs text-muted-foreground">{order.shipping_addr}</p>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {(order.order_items as any[]).map((item: any) => (
                                        <p key={item.id}>{item.products?.name} x{item.quantity}</p>
                                    ))}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    ${(order.total_cents / 100).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(order.created_at!).toLocaleDateString('es-AR')}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={
                                        order.status === 'completed' ? 'default' :
                                            order.status === 'pending' ? 'secondary' : 'destructive'
                                    }>
                                        {order.status === 'completed' ? 'Completada' :
                                            order.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <UpdateOrderStatus id={order.id} currentStatus={order.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}