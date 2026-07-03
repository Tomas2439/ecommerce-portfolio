import Navbar from '@/components/shared/navbar'

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                © 2025 Mi Tienda — Portfolio Project
            </footer>
        </div>
    )
}