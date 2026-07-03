import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DeleteCategoryButton } from '@/components/admin/DeleteCategoryButton'

export default async function CategoriasPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold">Categorías</h1>
                <Link href="/admin/categorias/nueva">
                    <Button>+ Nueva</Button>
                </Link>
            </div>

            {/* Desktop */}
            <div className="hidden md:block border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium">Nombre</th>
                            <th className="text-left px-4 py-3 font-medium">Slug</th>
                            <th className="text-left px-4 py-3 font-medium">Descripción</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                    No hay categorías todavía
                                </td>
                            </tr>
                        )}
                        {categories?.map(cat => (
                            <tr key={cat.id} className="border-t">
                                <td className="px-4 py-3 font-medium">{cat.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                                <td className="px-4 py-3 text-muted-foreground">{cat.description ?? '—'}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 justify-end">
                                        <Link href={`/admin/categorias/${cat.id}/editar`}>
                                            <Button variant="outline" size="sm">Editar</Button>
                                        </Link>
                                        <DeleteCategoryButton id={cat.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-3">
                {categories?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No hay categorías todavía</p>
                )}
                {categories?.map(cat => (
                    <div key={cat.id} className="border rounded-lg p-4 flex flex-col gap-3">
                        <div>
                            <p className="font-medium">{cat.name}</p>
                            <p className="text-sm text-muted-foreground">{cat.slug}</p>
                            {cat.description && (
                                <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/admin/categorias/${cat.id}/editar`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">Editar</Button>
                            </Link>
                            <DeleteCategoryButton id={cat.id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}