import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export default async function ProductosAdminPage() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold">Productos</h1>
                <Link href="/admin/productos/nuevo">
                    <Button>+ Nuevo producto</Button>
                </Link>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium">Nombre</th>
                            <th className="text-left px-4 py-3 font-medium">Categoría</th>
                            <th className="text-left px-4 py-3 font-medium">Precio</th>
                            <th className="text-left px-4 py-3 font-medium">Stock</th>
                            <th className="text-left px-4 py-3 font-medium">Estado</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    No hay productos todavía
                                </td>
                            </tr>
                        )}
                        {products?.map(product => (
                            <tr key={product.id} className="border-t">
                                <td className="px-4 py-3 font-medium">{product.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {(product.categories as any)?.name ?? '—'}
                                </td>
                                <td className="px-4 py-3">
                                    ${(product.price_cents / 100).toFixed(2)}
                                </td>
                                <td className="px-4 py-3">{product.stock_qty}</td>
                                <td className="px-4 py-3">
                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 flex gap-2 justify-end">
                                    <Link href={`/admin/productos/${product.id}/editar`}>
                                        <Button variant="outline" size="sm">Editar</Button>
                                    </Link>
                                    <DeleteProductButton id={product.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}