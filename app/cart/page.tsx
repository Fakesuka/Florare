// app/cart/page.tsx

'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, getDeliveryFee } from '@/lib/utils'
import { telegram } from '@/lib/telegram'
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/motion'
import { useEffect } from 'react'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotal, getItemsCount } = useCartStore()

  const subtotal = getTotal()
  const delivery = getDeliveryFee('Якутск')
  const total = subtotal + delivery

  useEffect(() => {
    if (items.length > 0) {
      telegram.showMainButton('Оформить заказ', () => router.push('/checkout'))
    } else {
      telegram.hideMainButton()
    }

    return () => telegram.hideMainButton()
  }, [items, router])

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(var(--accent-cream))] p-4">
        <motion.div {...FADE_IN_UP} className="text-center">
          <div className="mb-6 inline-flex rounded-full bg-white p-8 shadow-lg">
            <ShoppingBag className="h-16 w-16 text-[rgb(var(--primary-rose))]" />
          </div>
          <h2 className="heading-3 mb-3">Корзина пуста</h2>
          <p className="body-normal mb-6 text-[rgb(var(--text-dark))]/60">
            Добавьте букеты в корзину, чтобы оформить заказ
          </p>
          <button
            onClick={() => router.push('/catalog')}
            className="rounded-full bg-[rgb(var(--primary-rose))] px-8 py-4 font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            Перейти в каталог
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--accent-cream))] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[rgb(var(--neutral-warm))] safe-area-inset-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="font-serif text-xl font-semibold">
              Корзина ({getItemsCount()})
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Items */}
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="initial"
        animate="animate"
        className="container mx-auto px-4 py-6"
      >
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={`${item.productId}-${item.size.id}`}
              item={item}
              onRemove={() => {
                removeItem(item.productId)
                telegram.haptic('medium')
              }}
              onUpdateQuantity={(qty) => {
                updateQuantity(item.productId, qty)
                telegram.haptic('light')
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <div className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-[rgb(var(--neutral-warm))] safe-area-inset-bottom">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[rgb(var(--text-dark))]/60">
              <span>Товары ({getItemsCount()})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[rgb(var(--text-dark))]/60">
              <span>Доставка</span>
              <span>{formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between border-t border-[rgb(var(--neutral-warm))] pt-3 text-xl font-bold">
              <span>Итого</span>
              <span className="text-[rgb(var(--primary-rose))]">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItemCard({ item, onRemove, onUpdateQuantity }: any) {
  const itemTotal = item.size.price * item.quantity + (item.packaging?.price || 0)

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl bg-white shadow-md"
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(var(--accent-pink))] to-[rgb(var(--primary-rose))]" />

        {/* Info */}
        <div className="flex flex-1 flex-col">
          <h3 className="mb-1 font-medium">{item.product.name}</h3>
          <p className="mb-2 text-sm text-[rgb(var(--text-dark))]/60">
            Размер: {item.size.name}
          </p>
          {item.packaging && (
            <p className="mb-2 text-sm text-[rgb(var(--text-dark))]/60">
              Упаковка: {item.packaging.name}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--accent-cream))] transition-colors hover:bg-[rgb(var(--neutral-warm))] active:scale-95"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--accent-cream))] transition-colors hover:bg-[rgb(var(--neutral-warm))] active:scale-95"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="font-bold text-[rgb(var(--primary-rose))]">
                {formatPrice(itemTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="self-start p-2 text-[rgb(var(--text-dark))]/40 transition-colors hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {item.cardMessage && (
        <div className="border-t border-[rgb(var(--neutral-warm))] bg-[rgb(var(--accent-cream))]/50 p-4">
          <p className="text-sm italic text-[rgb(var(--text-dark))]/80">
            💌 "{item.cardMessage}"
          </p>
        </div>
      )}
    </motion.div>
  )
}
