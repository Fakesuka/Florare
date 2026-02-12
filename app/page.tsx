// app/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import storiesData from '@/data/stories.json'
import { telegram } from '@/lib/telegram'
import { STORY_SWIPE_VARIANTS, STORY_SWIPE_TRANSITION } from '@/lib/motion'

export default function HomePage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const story = storiesData[currentIndex]

  // Auto-advance story
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused])

  const handleNext = () => {
    if (currentIndex < storiesData.length - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
      telegram.haptic('light')
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
      telegram.haptic('light')
    }
  }

  const handleViewCollection = () => {
    telegram.haptic('medium')
    router.push(`/collections?id=${story.collectionId}`)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2 safe-area-inset-top">
        {storiesData.map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{
                width:
                  index < currentIndex
                    ? '100%'
                    : index === currentIndex
                    ? `${progress}%`
                    : '0%',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Story content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={STORY_SWIPE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={STORY_SWIPE_TRANSITION}
          className="absolute inset-0"
        >
          {/* Background image with gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/stories/placeholder-${(currentIndex % 3) + 1}.jpg')`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: story.gradient }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-6 safe-area-inset-bottom">
            {/* Tap areas for navigation */}
            <div className="absolute inset-0 flex">
              <button
                onClick={handlePrev}
                className="flex-1"
                disabled={currentIndex === 0}
                aria-label="Previous story"
              />
              <button
                onClick={handleNext}
                className="flex-1"
                disabled={currentIndex === storiesData.length - 1}
                aria-label="Next story"
              />
            </div>

            {/* Bottom content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-20 mt-auto"
            >
              <h1 className="heading-2 mb-2 text-white drop-shadow-lg">
                {story.title}
              </h1>
              {story.subtitle && (
                <p className="body-large mb-6 text-white/90 drop-shadow-md">
                  {story.subtitle}
                </p>
              )}

              <button
                onClick={handleViewCollection}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-[rgb(var(--text-dark))] shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Смотреть коллекцию
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation hints */}
      <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-30 flex justify-center gap-8 opacity-50">
        {currentIndex > 0 && (
          <div className="flex items-center gap-2 text-white">
            <ChevronLeft className="h-6 w-6" />
            <span className="text-sm">Назад</span>
          </div>
        )}
        {currentIndex < storiesData.length - 1 && (
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm">Далее</span>
            <ChevronRight className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}
