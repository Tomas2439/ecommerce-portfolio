'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/CartStore'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Navbar() {
    const { items, fetchCart } = useCartStore()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email ?? null)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                setIsAdmin(profile?.role === 'admin')
                fetchCart()
            }
        }
        loadUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            loadUser()
        })

        return () => subscription.unsubscribe()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        setUserEmail(null)
        setIsAdmin(false)
        toast.success('Sesión cerrada')
        router.push('/productos')
        router.refresh()
    }

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/productos" className="font-semibold text-lg">
                    Mi Tienda
                </Link>

                <nav className="flex items-center gap-4">
                    <Link href="/productos" className="text-sm hover:underline">
                        Productos
                    </Link>

                    {isAdmin && (
                        <Link href="/admin" className="text-sm hover:underline">
                            Admin
                        </Link>
                    )}

                    {userEmail && (
                        <Link href="/mis-ordenes" className="text-sm hover:underline">
                            Mis órdenes
                        </Link>
                    )}

                    <Link href="/carrito" className="relative">
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {userEmail ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden md:block">
                                {userEmail}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth">
                            <Button variant="outline" size="sm">
                                Ingresar
                            </Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}