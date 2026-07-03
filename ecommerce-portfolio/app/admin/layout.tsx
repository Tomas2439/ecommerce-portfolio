export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 border-r bg-muted/40 p-6">
                <p className="font-semibold mb-6">Panel Admin</p>
                <nav className="flex flex-col gap-2 text-sm">
                    <a href="/admin/productos" className="hover:underline">Productos</a>
                    <a href="/admin/categorias" className="hover:underline">Categorías</a>
                    <a href="/admin/ordenes" className="hover:underline">Órdenes</a>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}