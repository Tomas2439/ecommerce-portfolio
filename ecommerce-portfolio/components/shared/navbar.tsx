'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/CartStore'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ThemeToggle } from './ThemeToggle'

export default function Navbar() {
    const { items, fetchCart } = useCartStore()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
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
                {/* Logo */}
                <Link href="/productos" className="font-bold text-xl text-primary">
                    Mi<span style={{ color: 'hsl(var(--accent))' }}>Tienda</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-4">
                    <Link href="/productos" className="text-sm hover:text-primary transition-colors">
                        Productos
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-sm hover:text-primary transition-colors">
                            Admin
                        </Link>
                    )}
                    {userEmail && (
                        <Link href="/mis-ordenes" className="text-sm hover:text-primary transition-colors">
                            Mis órdenes
                        </Link>
                    )}

                    <ThemeToggle />

                    <Link href="/carrito" className="relative">
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold"
                                    style={{ backgroundColor: 'hsl(var(--accent))', color: 'white' }}>
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {userEmail ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden lg:block">{userEmail}</span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth">
                            <Button size="sm" style={{ backgroundColor: 'hsl(var(--accent))', color: 'white' }}>
                                Ingresar
                            </Button>
                        </Link>
                    )}
                </nav>

                {/* Mobile: carrito + menu */}
                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    <Link href="/carrito" className="relative">
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold"
                                    style={{ backgroundColor: 'hsl(var(--accent))', color: 'white' }}>
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-3">
                    <Link href="/productos" className="text-sm py-2" onClick={() => setMenuOpen(false)}>
                        Productos
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-sm py-2" onClick={() => setMenuOpen(false)}>
                            Admin
                        </Link>
                    )}
                    {userEmail && (
                        <Link href="/mis-ordenes" className="text-sm py-2" onClick={() => setMenuOpen(false)}>
                            Mis órdenes
                        </Link>
                    )}
                    {userEmail ? (
                        <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                            Cerrar sesión
                        </Button>
                    ) : (
                        <Link href="/auth" onClick={() => setMenuOpen(false)}>
                            <Button size="sm" className="w-full"
                                style={{ backgroundColor: 'hsl(var(--accent))', color: 'white' }}>
                                Ingresar
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </header>
    )
}