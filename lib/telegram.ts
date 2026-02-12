// lib/telegram.ts

/**
 * Telegram Web Apps SDK Bridge
 * Заглушка для будущей интеграции
 */

interface TelegramWebApp {
  initData: string
  initDataUnsafe: any
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive: boolean) => void
    hideProgress: () => void
    setParams: (params: any) => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  expand: () => void
  close: () => void
  ready: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  onEvent: (eventType: string, callback: () => void) => void
  offEvent: (eventType: string, callback: () => void) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

class TelegramBridge {
  private webApp: TelegramWebApp | null = null
  private isTelegram: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.webApp = window.Telegram?.WebApp || null
      this.isTelegram = !!this.webApp
      
      if (this.isTelegram && this.webApp) {
        this.init()
      }
    }
  }

  private init() {
    if (!this.webApp) return

    // Инициализация
    this.webApp.ready()
    this.webApp.expand()

    // Установка цветов темы
    this.applyTheme()

    // Отключение подтверждения закрытия
    this.webApp.disableClosingConfirmation()

    console.log('Telegram WebApp initialized', {
      version: this.webApp.version,
      platform: this.webApp.platform,
      colorScheme: this.webApp.colorScheme,
    })
  }

  private applyTheme() {
    if (!this.webApp) return

    const { themeParams, colorScheme } = this.webApp

    // Установка CSS переменных на основе темы Telegram
    if (themeParams.bg_color) {
      document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color)
    }
    if (themeParams.text_color) {
      document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color)
    }
    if (themeParams.button_color) {
      document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color)
    }

    // Установка темы (light/dark)
    document.documentElement.classList.toggle('dark', colorScheme === 'dark')
  }

  // Haptic Feedback
  haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection' = 'medium') {
    if (!this.webApp?.HapticFeedback) {
      console.log(`[Haptic Mock] ${type}`)
      return
    }

    switch (type) {
      case 'light':
      case 'medium':
      case 'heavy':
        this.webApp.HapticFeedback.impactOccurred(type)
        break
      case 'success':
      case 'error':
      case 'warning':
        this.webApp.HapticFeedback.notificationOccurred(type)
        break
      case 'selection':
        this.webApp.HapticFeedback.selectionChanged()
        break
    }
  }

  // Main Button
  showMainButton(text: string, onClick: () => void) {
    if (!this.webApp?.MainButton) {
      console.log(`[MainButton Mock] Show: ${text}`)
      return
    }

    this.webApp.MainButton.setText(text)
    this.webApp.MainButton.show()
    this.webApp.MainButton.enable()
    this.webApp.MainButton.onClick(onClick)
  }

  hideMainButton() {
    if (!this.webApp?.MainButton) {
      console.log('[MainButton Mock] Hide')
      return
    }

    this.webApp.MainButton.hide()
  }

  setMainButtonLoading(loading: boolean) {
    if (!this.webApp?.MainButton) {
      console.log(`[MainButton Mock] Loading: ${loading}`)
      return
    }

    if (loading) {
      this.webApp.MainButton.showProgress(false)
    } else {
      this.webApp.MainButton.hideProgress()
    }
  }

  // Back Button
  showBackButton(onClick: () => void) {
    if (!this.webApp?.BackButton) {
      console.log('[BackButton Mock] Show')
      return
    }

    this.webApp.BackButton.show()
    this.webApp.BackButton.onClick(onClick)
  }

  hideBackButton() {
    if (!this.webApp?.BackButton) {
      console.log('[BackButton Mock] Hide')
      return
    }

    this.webApp.BackButton.hide()
  }

  // Utils
  close() {
    if (!this.webApp) {
      console.log('[Telegram Mock] Close app')
      return
    }

    this.webApp.close()
  }

  getUserData() {
    if (!this.webApp) {
      return {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
      }
    }

    return this.webApp.initDataUnsafe.user || null
  }

  getColorScheme(): 'light' | 'dark' {
    if (!this.webApp) return 'light'
    return this.webApp.colorScheme
  }

  getThemeParams() {
    if (!this.webApp) {
      return {
        bg_color: '#ffffff',
        text_color: '#000000',
        button_color: '#C5A5B8',
        button_text_color: '#ffffff',
      }
    }

    return this.webApp.themeParams
  }

  isInTelegram(): boolean {
    return this.isTelegram
  }
}

// Singleton instance
export const telegram = new TelegramBridge()

// React Hook
export function useTelegram() {
  return {
    telegram,
    isInTelegram: telegram.isInTelegram(),
    user: telegram.getUserData(),
    colorScheme: telegram.getColorScheme(),
    themeParams: telegram.getThemeParams(),
  }
}
