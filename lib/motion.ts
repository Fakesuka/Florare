// lib/motion.ts

export const DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const

export const EASINGS = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  springGentle: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },
} as const

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.easeOutCubic,
  },
}

export const FADE_IN_UP = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.easeOutCubic,
  },
}

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: DURATIONS.fast,
  },
}

export const SCALE_IN = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.easeOutCubic,
  },
}

export const SLIDE_IN_FROM_BOTTOM = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.easeInOutQuart,
  },
}

export const SLIDE_IN_FROM_RIGHT = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.easeInOutQuart,
  },
}

export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export const SHARED_LAYOUT_TRANSITION = {
  type: 'spring',
  stiffness: 350,
  damping: 35,
}

export const HOVER_SCALE = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: {
    duration: DURATIONS.fast,
  },
}

export const BUTTON_TAP = {
  whileTap: { scale: 0.95 },
  transition: {
    duration: DURATIONS.fast,
  },
}

export const CARD_HOVER = {
  whileHover: { 
    y: -8,
    boxShadow: '0 20px 40px rgba(197, 165, 184, 0.15)',
  },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.easeOutCubic,
  },
}

export const STORY_SWIPE_VARIANTS = {
  enter: (direction: number) => ({
    y: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

export const STORY_SWIPE_TRANSITION = {
  y: { 
    type: 'spring', 
    stiffness: 300, 
    damping: 30 
  },
  opacity: { 
    duration: DURATIONS.fast 
  },
}

// Utility для reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const getTransition = (transition: any) => {
  if (prefersReducedMotion()) {
    return { duration: 0 }
  }
  return transition
}
