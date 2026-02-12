// app/builder/page.tsx

'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBuilderStore } from '@/store/builder'
import { useCartStore } from '@/store/cart'
import { telegram } from '@/lib/telegram'
import { formatPrice } from '@/lib/utils'
import { 
  BOUQUET_STYLES, 
  COLOR_PALETTES, 
  PACKAGING_OPTIONS, 
  CARD_DESIGNS 
} from '@/types'

const PRODUCT_SIZES = [
  { id: 'small', name: 'S', flowersCount: '15-21 цветок', price: 3500, height: '40-45 см' },
  { id: 'medium', name: 'M', flowersCount: '25-35 цветков', price: 5500, height: '50-55 см' },
  { id: 'large', name: 'L', flowersCount: '40-51 цветок', price: 8500, height: '60-65 см' },
  { id: 'xlarge', name: 'XL', flowersCount: '60+ цветков', price: 12000, height: '70-75 см' },
]

export default function BuilderPage() {
  const router = useRouter()
  const { 
    currentStep, 
    config, 
    nextStep, 
    prevStep,
    setStyle,
    setColorPalette,
    setSize,
    setPackaging,
    setCardMessage,
    setCardDesign,
    calculatePrice,
    isStepValid,
    getConfig,
    reset,
  } = useBuilderStore()
  
  const addItem = useCartStore((state) => state.addItem)

  // Telegram Main Button integration
  useEffect(() => {
    if (currentStep === 6) {
      telegram.showMainButton('Добавить в корзину', handleAddToCart)
    } else {
      telegram.hideMainButton()
    }

    return () => telegram.hideMainButton()
  }, [currentStep])

  const handleAddToCart = () => {
    const bouquetConfig = getConfig()
    if (!bouquetConfig) return

    // Create a product from config
    const product = {
      id: `custom-${Date.now()}`,
      name: 'Авторский букет',
      description: `Стиль: ${bouquetConfig.style}, Палитра: ${bouquetConfig.colorPalette}`,
      price: bouquetConfig.size.price,
      rating: 5,
      reviewsCount: 0,
      images: ['/images/custom-bouquet.jpg'],
      category: 'custom',
      sizes: [bouquetConfig.size],
      colors: [],
      composition: [],
      care: [],
      inStock: true,
    }

    addItem(product, bouquetConfig.size, bouquetConfig.packaging, bouquetConfig.cardMessage, bouquetConfig.cardDesign)
    telegram.haptic('success')
    reset()
    router.push('/cart')
  }

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      nextStep()
      telegram.haptic('light')
    }
  }

  const handlePrev = () => {
    prevStep()
    telegram.haptic('light')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[rgb(var(--accent-cream))]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[rgb(var(--neutral-warm))] safe-area-inset-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="font-serif text-xl font-semibold">Конструктор букета</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="glass border-b border-[rgb(var(--neutral-warm))]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    currentStep === step
                      ? 'border-[rgb(var(--primary-rose))] bg-[rgb(var(--primary-rose))] text-white'
                      : currentStep > step
                      ? 'border-[rgb(var(--primary-sage))] bg-[rgb(var(--primary-sage))] text-white'
                      : 'border-[rgb(var(--neutral-warm))] bg-white text-[rgb(var(--text-dark))]/40'
                  }`}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                <span className="text-xs text-[rgb(var(--text-dark))]/60">
                  {['Стиль', 'Цвет', 'Размер', 'Упаковка', 'Открытка', 'Итог'][step - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6"
          >
            {currentStep === 1 && <StepStyle value={config.style} onChange={setStyle} />}
            {currentStep === 2 && <StepColor value={config.colorPalette} onChange={setColorPalette} />}
            {currentStep === 3 && <StepSize value={config.size} onChange={setSize} />}
            {currentStep === 4 && <StepPackaging value={config.packaging} onChange={setPackaging} />}
            {currentStep === 5 && <StepCard messageValue={config.cardMessage} designValue={config.cardDesign} onMessageChange={setCardMessage} onDesignChange={setCardDesign} />}
            {currentStep === 6 && <StepSummary config={getConfig()} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="glass border-t border-[rgb(var(--neutral-warm))] safe-area-inset-bottom">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
              Назад
            </button>

            <div className="text-center">
              <div className="text-sm text-[rgb(var(--text-dark))]/60">Итого:</div>
              <div className="text-2xl font-bold text-[rgb(var(--primary-rose))]">
                {formatPrice(calculatePrice())}
              </div>
            </div>

            {currentStep < 6 && (
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2 rounded-full bg-[rgb(var(--primary-rose))] px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-30 active:scale-95"
              >
                Далее
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step components
function StepStyle({ value, onChange }: any) {
  return (
    <div>
      <h2 className="heading-3 mb-6">Выберите стиль букета</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {BOUQUET_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => { onChange(style.id); telegram.haptic('selection') }}
            className={`overflow-hidden rounded-2xl border-2 transition-all ${
              value === style.id
                ? 'border-[rgb(var(--primary-rose))] shadow-lg'
                : 'border-transparent shadow-md hover:border-[rgb(var(--neutral-warm))]'
            }`}
          >
            <div className="aspect-square bg-gradient-to-br from-[rgb(var(--accent-pink))] to-[rgb(var(--primary-rose))]" />
            <div className="p-4 text-center font-medium">{style.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepColor({ value, onChange }: any) {
  return (
    <div>
      <h2 className="heading-3 mb-6">Выберите цветовую палитру</h2>
      <div className="space-y-4">
        {COLOR_PALETTES.map((palette) => (
          <button
            key={palette.id}
            onClick={() => { onChange(palette.id); telegram.haptic('selection') }}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
              value === palette.id
                ? 'border-[rgb(var(--primary-rose))] shadow-lg'
                : 'border-transparent shadow-md hover:border-[rgb(var(--neutral-warm))]'
            }`}
          >
            <div className="flex gap-2">
              {palette.colors.map((color, i) => (
                <div
                  key={i}
                  className="h-12 w-12 rounded-full shadow-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="font-medium">{palette.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepSize({ value, onChange }: any) {
  return (
    <div>
      <h2 className="heading-3 mb-6">Выберите размер</h2>
      <div className="grid gap-4">
        {PRODUCT_SIZES.map((size) => (
          <button
            key={size.id}
            onClick={() => { onChange(size); telegram.haptic('selection') }}
            className={`rounded-2xl border-2 p-6 text-left transition-all ${
              value?.id === size.id
                ? 'border-[rgb(var(--primary-rose))] shadow-lg'
                : 'border-transparent shadow-md hover:border-[rgb(var(--neutral-warm))]'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xl font-bold">{size.name}</span>
              <span className="text-2xl font-bold text-[rgb(var(--primary-rose))]">
                {formatPrice(size.price)}
              </span>
            </div>
            <p className="mb-1 text-[rgb(var(--text-dark))]/60">{size.flowersCount}</p>
            <p className="text-sm text-[rgb(var(--text-dark))]/40">Высота: {size.height}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepPackaging({ value, onChange }: any) {
  return (
    <div>
      <h2 className="heading-3 mb-6">Выберите упаковку</h2>
      <div className="grid grid-cols-2 gap-4">
        {PACKAGING_OPTIONS.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => { onChange(pkg); telegram.haptic('selection') }}
            className={`overflow-hidden rounded-2xl border-2 transition-all ${
              value?.id === pkg.id
                ? 'border-[rgb(var(--primary-rose))] shadow-lg'
                : 'border-transparent shadow-md hover:border-[rgb(var(--neutral-warm))]'
            }`}
          >
            <div className="aspect-square bg-gradient-to-br from-[rgb(var(--accent-cream))] to-[rgb(var(--neutral-warm))]" />
            <div className="p-4">
              <div className="mb-1 font-medium">{pkg.name}</div>
              <div className="text-sm font-medium text-[rgb(var(--primary-rose))]">
                {pkg.price === 0 ? 'Бесплатно' : `+${formatPrice(pkg.price)}`}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepCard({ messageValue, designValue, onMessageChange, onDesignChange }: any) {
  return (
    <div>
      <h2 className="heading-3 mb-6">Добавьте открытку (опционально)</h2>
      
      <div className="mb-6">
        <label className="mb-2 block font-medium">Дизайн открытки</label>
        <div className="grid grid-cols-2 gap-4">
          {CARD_DESIGNS.map((design) => (
            <button
              key={design.id}
              onClick={() => { onDesignChange(design.id); telegram.haptic('selection') }}
              className={`overflow-hidden rounded-xl border-2 transition-all ${
                designValue === design.id
                  ? 'border-[rgb(var(--primary-rose))] shadow-lg'
                  : 'border-transparent shadow-md hover:border-[rgb(var(--neutral-warm))]'
              }`}
            >
              <div className="aspect-[3/2] bg-gradient-to-br from-[rgb(var(--accent-pink))] to-[rgb(var(--primary-rose))]" />
              <div className="p-3 text-center text-sm font-medium">{design.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-medium">Текст поздравления</label>
        <textarea
          value={messageValue || ''}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Напишите пожелание..."
          maxLength={200}
          rows={4}
          className="w-full rounded-xl border-2 border-[rgb(var(--neutral-warm))] p-4 focus:border-[rgb(var(--primary-rose))] focus:outline-none"
        />
        <div className="mt-1 text-right text-sm text-[rgb(var(--text-dark))]/40">
          {messageValue?.length || 0}/200
        </div>
      </div>
    </div>
  )
}

function StepSummary({ config }: any) {
  if (!config) return <div>Заполните все шаги</div>

  return (
    <div>
      <h2 className="heading-3 mb-6">Ваш букет готов!</h2>
      
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-4 font-serif text-xl font-semibold">Характеристики</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--text-dark))]/60">Стиль:</dt>
              <dd className="font-medium">{config.style}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--text-dark))]/60">Цветовая палитра:</dt>
              <dd className="font-medium">{config.colorPalette}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--text-dark))]/60">Размер:</dt>
              <dd className="font-medium">{config.size.name} — {config.size.flowersCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--text-dark))]/60">Упаковка:</dt>
              <dd className="font-medium">{config.packaging.name}</dd>
            </div>
          </dl>
        </div>

        {config.cardMessage && (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-2 font-serif text-xl font-semibold">Открытка</h3>
            <p className="italic text-[rgb(var(--text-dark))]/80">"{config.cardMessage}"</p>
          </div>
        )}

        <div className="rounded-2xl bg-[rgb(var(--primary-rose))] p-6 text-white shadow-lg">
          <div className="mb-2 text-sm opacity-90">Итоговая стоимость:</div>
          <div className="text-4xl font-bold">{formatPrice(config.price)}</div>
        </div>
      </div>
    </div>
  )
}
