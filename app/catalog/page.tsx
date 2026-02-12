// app/catalog/page.tsx

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import productsData from '@/data/products.json'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { telegram } from '@/lib/telegram'
import { STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/motion'

export default function CatalogPage() {
  const [filter, setFilter] = useState('all')
  const addItem = useCartStore((state) => state.addItem)

  const filteredProducts = filter === 'all' 
    ? productsData 
    : productsData.filter(p => p.collection === filter)

  const handleQuickAdd = (product: any) => {
    addItem(product, product.sizes[0])
    telegram.haptic('success')
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--accent-cream))]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[rgb(var(--neutral-warm))] safe-area-inset-top">
        <div className="container mx-auto px-4 py-4">
          <h1 className="heading-3 text-center">Каталог</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-[72px] z-30 glass border-b border-[rgb(var(--neutral-warm))]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'Все' },
              { id: 'romantic', label: 'Романтика' },
              { id: 'luxury', label: 'Премиум' },
              { id: 'minimal', label: 'Минимализм' },
              { id: 'birthday', label: 'День рождения' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-[rgb(var(--primary-rose))] text-white'
                    : 'bg-white text-[rgb(var(--text-dark))] hover:bg-[rgb(var(--neutral-warm))]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="initial"
        animate="animate"
        className="container mx-auto px-4 py-8"
      >
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={STAGGER_ITEM}
              className="mb-4 break-inside-avoid"
            >
              <ProductCard product={product} onQuickAdd={handleQuickAdd} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function ProductCard({ product, onQuickAdd }: any) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundImage: `url('/images/products/placeholder-${(parseInt(product.id) % 10) + 1}.jpg')`,
            }}
          />
          
          {/* Discount badge */}
          {product.oldPrice && (
            <div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </div>
          )}

          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
              telegram.haptic('selection')
            }}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-[rgb(var(--text-dark))]'
              }`}
            />
          </button>

          {/* Quick add button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onQuickAdd(product)
            }}
            className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--primary-rose))] text-white shadow-lg opacity-0 transition-all group-hover:opacity-100 hover:scale-110 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="mb-1 font-medium text-[rgb(var(--text-dark))]">
            {product.name}
          </h3>
          <p className="mb-2 text-sm text-[rgb(var(--text-dark))]/60 line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating */}
          <div className="mb-2 flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{product.rating}</span>
            <span className="text-[rgb(var(--text-dark))]/40">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[rgb(var(--primary-rose))]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[rgb(var(--text-dark))]/40 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
