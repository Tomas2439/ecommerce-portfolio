'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ShoppingBag, Menu, X, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/categorias', label: 'Categorías', icon: Tag },
    { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingBag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* Mobile header */}
            <div className="md:hidden flex items-center justify-between border-b px-4 h-14 bg-background sticky top-0 z-40">
                <p className="font-semibold text-primary">Panel Admin</p>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile menu desplegable */}
            {sidebarOpen && (
                <div className="md:hidden border-b bg-background px-4 py-3 flex flex-col gap-1">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${pathname === item.href
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                    <div className="border-t mt-2 pt-2">
                        <Link href="/productos" onClick={() => setSidebarOpen(false)}>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Ver tienda
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-64 border-r bg-muted/40 flex-col p-6 sticky top-16 h-[calc(100vh-4rem)]">
                <p className="font-semibold text-primary mb-6">Panel Admin</p>
                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${pathname === item.href
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="border-t pt-4">
                    <Link href="/productos">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Ver tienda
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Contenido */}
            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}