'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/CartStore'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

export default function CarritoPage() {
    const { items, loading, fetchCart, removeItem, updateQuantity } = useCartStore()

    useEffect(() => {
        fetchCart()
    }, [])

    const total = items.reduce(
        (acc, item) => acc + item.products.price_cents * item.quantity,
        0
    )

    if (loading) return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <p className="text-muted-foreground">Cargando carrito...</p>
        </div>
    )

    if (items.length === 0) return (
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
            <Link href="/productos">
                <Button>Ver productos</Button>
            </Link>
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Tu carrito</h1>

            <div className="flex flex-col gap-4">
                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
                        {/* Imagen */}
                        <div className="w-20 h-20 bg-muted rounded-md overflow-hidden shrink-0">
                            {item.products.image_url ? (
                                <img
                                    src={item.products.image_url}
                                    alt={item.products.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                    Sin img
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.products.name}</p>
                            <p className="text-sm text-muted-foreground">
                                ${(item.products.price_cents / 100).toFixed(2)} c/u
                            </p>
                        </div>

                        {/* Cantidad */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Subtotal */}
                        <p className="font-semibold w-24 text-right">
                            ${((item.products.price_cents * item.quantity) / 100).toFixed(2)}
                        </p>

                        {/* Eliminar */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Total y checkout */}
            <div className="mt-8 border-t pt-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">${(total / 100).toFixed(2)}</p>
                </div>
                <Link href="/checkout">
                    <Button size="lg">Ir al checkout</Button>
                </Link>
            </div>
        </div>
    )
}