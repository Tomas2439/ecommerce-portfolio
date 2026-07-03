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
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Sin imagen
                        </div>
                    )}
                </div>
                <CardContent className="p-3 flex flex-col gap-1">
                    {product.categories && (
                        <Badge variant="secondary" className="w-fit text-xs px-1.5 py-0">
                            {(product.categories as any).name}
                        </Badge>
                    )}
                    <p className="font-medium text-sm leading-tight line-clamp-2">{product.name}</p>
                    <p className="text-base font-semibold text-primary">
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