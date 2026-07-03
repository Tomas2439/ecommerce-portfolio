'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/CartStore'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function CheckoutPage() {
    const { items, fetchCart, clearCart } = useCartStore()
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [cardExpiry, setCardExpiry] = useState('')
    const [cardCvc, setCardCvc] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [orderId, setOrderId] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchCart()
    }, [])

    const total = items.reduce(
        (acc, item) => acc + item.products.price_cents * item.quantity,
        0
    )

    async function handleCheckout(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error('Tenés que iniciar sesión')
            router.push('/auth')
            return
        }

        // 1. Crear orden en estado pending
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                status: 'pending',
                total_cents: total,
                shipping_name: name,
                shipping_addr: address,
            })
            .select('id')
            .single()

        if (orderError || !order) {
            toast.error('Error al crear la orden')
            setLoading(false)
            return
        }

        // 2. Insertar order_items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_cents: item.products.price_cents,
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            toast.error('Error al guardar los items')
            setLoading(false)
            return
        }

        // 3. Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 4. Cambiar estado a completed
        await supabase
            .from('orders')
            .update({ status: 'completed', updated_at: new Date().toISOString() })
            .eq('id', order.id)

        // 5. Vaciar carrito
        const { data: cart } = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (cart) {
            await supabase.from('cart_items').delete().eq('cart_id', cart.id)
        }

        clearCart()
        setOrderId(order.id)
        setSuccess(true)
        setLoading(false)
    }

    if (success) return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-semibold mb-2">¡Pago confirmado!</h1>
            <p className="text-muted-foreground mb-2">Tu orden fue procesada exitosamente.</p>
            <p className="text-xs text-muted-foreground mb-8">
                Orden: <span className="font-mono">{orderId}</span>
            </p>
            <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push('/productos')}>
                    Seguir comprando
                </Button>
                <Button variant="outline" onClick={() => router.push('/mis-ordenes')}>
                    Ver mis órdenes
                </Button>
            </div>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario */}
                <form onSubmit={handleCheckout} className="flex flex-col gap-6">
                    {/* Datos de envío */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Datos de envío</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Nombre completo</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Juan Pérez"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Av. Corrientes 1234, Buenos Aires"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Datos de pago (simulado) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Pago simulado
                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                    (no se procesa ningún cobro real)
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="card">Número de tarjeta</Label>
                                <Input
                                    id="card"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="expiry">Vencimiento</Label>
                                    <Input
                                        id="expiry"
                                        value={cardExpiry}
                                        onChange={e => setCardExpiry(e.target.value)}
                                        placeholder="MM/AA"
                                        maxLength={5}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input
                                        id="cvc"
                                        value={cardCvc}
                                        onChange={e => setCardCvc(e.target.value)}
                                        placeholder="123"
                                        maxLength={3}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" disabled={loading || items.length === 0}>
                        {loading ? 'Procesando pago...' : `Confirmar pago — $${(total / 100).toFixed(2)}`}
                    </Button>
                </form>

                {/* Resumen */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Resumen del pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="truncate mr-4">
                                        {item.products.name} × {item.quantity}
                                    </span>
                                    <span className="shrink-0 font-medium">
                                        ${((item.products.price_cents * item.quantity) / 100).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <div className="border-t pt-3 flex justify-between font-semibold">
                                <span>Total</span>
                                <span>${(total / 100).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}