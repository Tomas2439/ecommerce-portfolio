import type { Database } from './database.types'

// Tipos de filas (lo que devuelve Supabase al hacer SELECT)
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Cart = Database['public']['Tables']['carts']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

// Enum de estado de orden
export type OrderStatus = Database['public']['Enums']['order_status']

// Tipos extendidos (joins frecuentes)
export type ProductWithCategory = Product & {
    categories: Category | null
}

export type CartItemWithProduct = CartItem & {
    products: Product
}

export type OrderWithItems = Order & {
    order_items: (OrderItem & {
        products: Product
    })[]
}