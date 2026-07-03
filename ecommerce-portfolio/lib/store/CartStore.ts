import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { CartItemWithProduct } from '@/lib/types'

interface CartStore {
    items: CartItemWithProduct[]
    loading: boolean
    fetchCart: () => Promise<void>
    addItem: (productId: string) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    clearCart: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    loading: false,

    fetchCart: async () => {
        set({ loading: true })
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { set({ items: [], loading: false }); return }

        // Obtener o crear carrito
        let { data: cart } = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!cart) {
            const { data: newCart } = await supabase
                .from('carts')
                .insert({ user_id: user.id })
                .select('id')
                .single()
            cart = newCart
        }

        if (!cart) { set({ loading: false }); return }

        const { data: items } = await supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('cart_id', cart.id)

        set({ items: (items as CartItemWithProduct[]) ?? [], loading: false })
    },

    addItem: async (productId: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Obtener o crear carrito
        let { data: cart } = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!cart) {
            const { data: newCart } = await supabase
                .from('carts')
                .insert({ user_id: user.id })
                .select('id')
                .single()
            cart = newCart
        }

        if (!cart) return

        // Si ya existe el item, aumentar cantidad
        const existing = get().items.find(i => i.product_id === productId)

        if (existing) {
            await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + 1 })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('cart_items')
                .insert({ cart_id: cart.id, product_id: productId, quantity: 1 })
        }

        await get().fetchCart()
    },

    removeItem: async (itemId: string) => {
        const supabase = createClient()
        await supabase.from('cart_items').delete().eq('id', itemId)
        await get().fetchCart()
    },

    updateQuantity: async (itemId: string, quantity: number) => {
        if (quantity < 1) { await get().removeItem(itemId); return }
        const supabase = createClient()
        await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
        await get().fetchCart()
    },

    clearCart: () => set({ items: [] }),
}))