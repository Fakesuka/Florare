// store/cart.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductSize, PackagingOption } from '@/types'
import { telegram } from '@/lib/telegram'

interface CartStore {
  items: CartItem[]
  addItem: (
    product: Product,
    size: ProductSize,
    packaging?: PackagingOption,
    cardMessage?: string,
    cardDesign?: string
  ) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updatePackaging: (productId: string, packaging: PackagingOption) => void
  updateCardMessage: (productId: string, message: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemsCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, packaging, cardMessage, cardDesign) => {
        const existingItem = get().items.find(
          (item) => item.productId === product.id && item.size.id === size.id
        )

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.productId === product.id && item.size.id === size.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [
              ...get().items,
              {
                productId: product.id,
                product,
                size,
                quantity: 1,
                packaging,
                cardMessage,
                cardDesign,
              },
            ],
          })
        }

        // Haptic feedback
        telegram.haptic('success')
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
        telegram.haptic('medium')
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })
        telegram.haptic('light')
      },

      updatePackaging: (productId, packaging) => {
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, packaging } : item
          ),
        })
        telegram.haptic('selection')
      },

      updateCardMessage: (productId, message) => {
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, cardMessage: message } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const itemTotal = item.size.price * item.quantity
          const packagingCost = item.packaging?.price || 0
          return total + itemTotal + packagingCost
        }, 0)
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'florale-cart',
    }
  )
)
