// store/builder.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BouquetConfig, PackagingOption, ProductSize } from '@/types'
import { BOUQUET_STYLES, COLOR_PALETTES, PACKAGING_OPTIONS } from '@/types'

interface BuilderStore {
  currentStep: number
  config: Partial<BouquetConfig>
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setStyle: (style: string) => void
  setColorPalette: (palette: string) => void
  setSize: (size: ProductSize) => void
  setPackaging: (packaging: PackagingOption) => void
  setRibbonColor: (color: string) => void
  setCardMessage: (message: string) => void
  setCardDesign: (design: string) => void
  calculatePrice: () => number
  isStepValid: (step: number) => boolean
  reset: () => void
  getConfig: () => BouquetConfig | null
}

const PRODUCT_SIZES: ProductSize[] = [
  { id: 'small', name: 'S', flowersCount: '15-21 цветок', price: 3500, height: '40-45 см' },
  { id: 'medium', name: 'M', flowersCount: '25-35 цветков', price: 5500, height: '50-55 см' },
  { id: 'large', name: 'L', flowersCount: '40-51 цветок', price: 8500, height: '60-65 см' },
  { id: 'xlarge', name: 'XL', flowersCount: '60+ цветков', price: 12000, height: '70-75 см' },
]

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      config: {},

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 6 && get().isStepValid(currentStep)) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },

      setStyle: (style) => {
        set((state) => ({
          config: { ...state.config, style },
        }))
      },

      setColorPalette: (colorPalette) => {
        set((state) => ({
          config: { ...state.config, colorPalette },
        }))
      },

      setSize: (size) => {
        set((state) => ({
          config: { ...state.config, size },
        }))
      },

      setPackaging: (packaging) => {
        set((state) => ({
          config: { ...state.config, packaging },
        }))
      },

      setRibbonColor: (ribbonColor) => {
        set((state) => ({
          config: { ...state.config, ribbonColor },
        }))
      },

      setCardMessage: (cardMessage) => {
        set((state) => ({
          config: { ...state.config, cardMessage },
        }))
      },

      setCardDesign: (cardDesign) => {
        set((state) => ({
          config: { ...state.config, cardDesign },
        }))
      },

      calculatePrice: () => {
        const { config } = get()
        const basePrice = config.size?.price || 0
        const packagingPrice = config.packaging?.price || 0
        return basePrice + packagingPrice
      },

      isStepValid: (step) => {
        const { config } = get()

        switch (step) {
          case 1:
            return !!config.style
          case 2:
            return !!config.colorPalette
          case 3:
            return !!config.size
          case 4:
            return !!config.packaging
          case 5:
            return true // Card message is optional
          case 6:
            return true
          default:
            return false
        }
      },

      reset: () => {
        set({
          currentStep: 1,
          config: {},
        })
      },

      getConfig: () => {
        const { config } = get()
        if (
          config.style &&
          config.colorPalette &&
          config.size &&
          config.packaging
        ) {
          return {
            ...config,
            price: get().calculatePrice(),
          } as BouquetConfig
        }
        return null
      },
    }),
    {
      name: 'florale-builder',
    }
  )
)
