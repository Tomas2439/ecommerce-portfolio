import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function MisOrdenesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth')

    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Mis órdenes</h1>

            {orders?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No tenés órdenes todavía</p>
                    <Link href="/productos">
                        <Button>Ver productos</Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders?.map(order => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-mono text-muted-foreground">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(order.created_at!).toLocaleDateString('es-AR')}
                                    </span>
                                    <Badge variant={order.status === 'completed' ? 'default' : order.status === 'pending' ? 'secondary' : 'destructive'}>
                                        {order.status === 'completed' ? 'Completada' : order.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {(order.order_items as any[]).map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-3 text-sm">
                                        <div className="w-10 h-10 bg-muted rounded overflow-hidden shrink-0">
                                            {item.products?.image_url ? (
                                                <img
                                                    src={item.products.image_url}
                                                    alt={item.products.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted" />
                                            )}
                                        </div>
                                        <span className="flex-1">{item.products?.name}</span>
                                        <span className="text-muted-foreground">x{item.quantity}</span>
                                        <span className="font-medium">
                                            ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t pt-3 flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>${(order.total_cents / 100).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}