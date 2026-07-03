import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ProductWithCategory } from '@/lib/types'

export function ProductCard({ product }: { product: ProductWithCategory }) {
    return (
        <Link href={`/productos/${product.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            Sin imagen
                        </div>
                    )}
                </div>
                <CardContent className="p-4 flex flex-col gap-2">
                    {product.categories && (
                        <Badge variant="secondary" className="w-fit text-xs">
                            {(product.categories as any).name}
                        </Badge>
                    )}
                    <p className="font-medium leading-tight">{product.name}</p>
                    <p className="text-lg font-semibold">
                        ${(product.price_cents / 100).toFixed(2)}
                    </p>
                    {product.stock_qty === 0 && (
                        <p className="text-xs text-destructive">Sin stock</p>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}