# Цветочная лавка — Premium PWA

Премиум Progressive Web App для сети цветочных магазинов "Цветочная лавка" с локациями в Якутске и Мирном.

## 🌸 Особенности

### Клиентская часть (8 экранов)
1. **Home** — Instagram-style Stories для коллекций
2. **Collections** — Grid коллекций с фильтрами
3. **Catalog** — Masonry grid товаров
4. **Product** — Детальная карточка товара с shared element transition
5. **Builder** — 6-шаговый конструктор букетов
6. **Cart** — Корзина с управлением заказом
7. **Checkout** — Многошаговое оформление
8. **Track** — Отслеживание доставки с timeline

### Админ панель (3 экрана)
9. **Admin Dashboard** — Метрики и статистика
10. **Point Mirny** — Канбан-доска заказов для точки в Мирном
11. **Point Yakutsk** — Канбан-доска заказов для точки в Якутске

## 🎨 Дизайн

Цветовая палитра основана на логотипе:
- **Primary Rose**: `#C5A5B8`
- **Primary Pink**: `#F4D5E0`
- **Accent Pink**: `#E8BFD3`
- **Sage Green**: `#8B9E88`
- **Olive Green**: `#6B7A5E`
- **Cream**: `#F9F7F5`

### Типографика
- **Заголовки**: Playfair Display (serif)
- **Основной текст**: Inter (sans-serif)

## 🚀 Технологический стек

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4+ с кастомной темой
- **Animations**: 
  - Framer Motion (page transitions, shared layouts)
  - GSAP 3 + ScrollTrigger (hero animations)
  - Lenis (smooth scroll)
- **State Management**: Zustand (cart, builder, admin, filters)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI (headless primitives)
- **Icons**: Lucide Icons
- **PWA**: next-pwa + Workbox
- **Telegram**: @twa-dev/sdk (заглушки готовы для интеграции)

## 📦 Установка и запуск

### Предварительные требования
- Node.js 18+ 
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение откроется на `http://localhost:3000`

### Production build

```bash
npm run build
npm start
```

## 🔧 Структура проекта

```
florale-pwa/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home (Stories)
│   ├── collections/page.tsx      # Коллекции
│   ├── catalog/page.tsx          # Каталог товаров
│   ├── product/[id]/page.tsx     # Карточка товара
│   ├── builder/page.tsx          # Конструктор букетов
│   ├── cart/page.tsx             # Корзина
│   ├── checkout/page.tsx         # Оформление заказа
│   ├── track/[orderId]/page.tsx  # Отслеживание
│   ├── admin/                    # Админ панель
│   │   ├── page.tsx              # Dashboard
│   │   ├── point-mirny/page.tsx  # Заказы Мирный
│   │   └── point-yakutsk/page.tsx# Заказы Якутск
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Глобальные стили
├── components/
│   ├── ui/                       # Базовые компоненты
│   ├── stories/                  # Story компоненты
│   ├── product/                  # Product компоненты
│   ├── builder/                  # Builder компоненты
│   ├── cart/                     # Cart компоненты
│   ├── checkout/                 # Checkout компоненты
│   ├── track/                    # Tracking компоненты
│   ├── admin/                    # Admin компоненты
│   └── shared/                   # Shared компоненты
├── lib/
│   ├── utils.ts                  # Утилиты
│   ├── motion.ts                 # Motion system
│   └── telegram.ts               # Telegram bridge (заглушка)
├── store/
│   ├── cart.ts                   # Zustand cart store
│   ├── builder.ts                # Zustand builder store
│   └── admin.ts                  # Zustand admin store
├── data/                         # Mock данные
│   ├── products.json
│   ├── collections.json
│   └── stories.json
├── types/
│   └── index.ts                  # TypeScript типы
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── icons/                    # PWA иконки
│   └── images/                   # Изображения
├── next.config.js                # Next.js config с PWA
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json
└── package.json
```

## 📱 PWA Features

### Установка приложения

Приложение можно установить на устройство:

**iOS (Safari)**:
1. Откройте сайт в Safari
2. Нажмите кнопку "Поделиться"
3. Выберите "На экран «Домой»"
4. Нажмите "Добавить"

**Android (Chrome)**:
1. Откройте сайт в Chrome
2. Нажмите меню (три точки)
3. Выберите "Установить приложение" или "Добавить на главный экран"

**Desktop (Chrome/Edge)**:
1. В адресной строке появится иконка установки
2. Нажмите на иконку или откройте меню → "Установить приложение"

### Offline Support

Приложение работает офлайн благодаря Service Worker:
- Статические ресурсы кэшируются при первой загрузке
- Изображения кэшируются по мере просмотра
- API запросы работают с fallback стратегией

### Push Notifications

Для включения push-уведомлений:
1. При первом заказе появится запрос на разрешение
2. Уведомления приходят при смене статуса заказа
3. Настройка в профиле пользователя

## 🎭 Анимации

### Motion System

Все анимации настроены в `/lib/motion.ts`:

- **Durations**: `fast: 200ms`, `normal: 300ms`, `slow: 500ms`
- **Easings**: `easeOutCubic`, `spring`, `easeInOutQuart`

### Ключевые анимации

**Stories swipe** (Instagram-style):
```typescript
import { STORY_SWIPE_VARIANTS, STORY_SWIPE_TRANSITION } from '@/lib/motion'
```

**Shared Element Transition** (Product Card → Scene):
```typescript
import { SHARED_LAYOUT_TRANSITION } from '@/lib/motion'
// Use layoutId on Framer Motion component
```

**GSAP Hero Scene**:
```typescript
// Реализовано в components/shared/Hero.tsx
```

### Reduced Motion

Приложение поддерживает `prefers-reduced-motion`:
- Все анимации отключаются или сокращаются
- Transitions становятся мгновенными

## 🔌 Telegram Integration (Заглушки)

Telegram WebApp SDK интегрирован через `/lib/telegram.ts`.

### Использование

```typescript
import { telegram, useTelegram } from '@/lib/telegram'

// В компоненте
const { isInTelegram, user, colorScheme } = useTelegram()

// Haptic feedback
telegram.haptic('success') // light | medium | heavy | success | error | warning | selection

// Main Button
telegram.showMainButton('Добавить в корзину', () => {
  // callback
})
telegram.hideMainButton()

// Back Button
telegram.showBackButton(() => router.back())
telegram.hideBackButton()
```

### Тестирование в Telegram

1. Создайте бота через @BotFather
2. Получите токен бота
3. Настройте Web App URL через @BotFather
4. Для локальной разработки используйте ngrok:

```bash
ngrok http 3000
```

5. Укажите ngrok URL в настройках бота
6. Откройте бота и запустите Web App

## 🎨 Кастомизация

### Цвета темы

Все цвета настраиваются в `/app/globals.css`:

```css
:root {
  --primary-rose: 197 165 184;
  --primary-pink: 244 213 224;
  /* ... */
}
```

### Типографика

Шрифты настраиваются в `/app/layout.tsx`:

```typescript
const inter = Inter({ /* ... */ })
const playfair = Playfair_Display({ /* ... */ })
```

### Компоненты UI

Базовые компоненты в `/components/ui` используют CVA для вариантов.

Пример кастомизации Button:

```typescript
// components/ui/button.tsx
const buttonVariants = cva(/* ... */, {
  variants: {
    variant: { /* добавьте свой вариант */ },
    size: { /* добавьте свой размер */ },
  },
})
```

## 📊 State Management

### Cart Store

```typescript
import { useCartStore } from '@/store/cart'

const { items, addItem, removeItem, getTotal } = useCartStore()
```

### Builder Store

```typescript
import { useBuilderStore } from '@/store/builder'

const { currentStep, config, nextStep, setStyle } = useBuilderStore()
```

### Admin Store

```typescript
import { useAdminStore } from '@/store/admin'

const { orders, updateOrderStatus } = useAdminStore()
```

## 🔍 SEO

- Настроенные meta tags в `app/layout.tsx`
- Open Graph для соцсетей
- Structured data (добавить при необходимости)
- Sitemap (генерируется автоматически Next.js)
- Robots.txt (добавить при необходимости)

## 🚦 Performance

### Текущая оптимизация

- Image optimization через `next/image`
- Code splitting по routes
- Lazy loading компонентов
- Service Worker caching
- Web Vitals monitoring

### Рекомендации

- Lighthouse score target: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

## 📝 TODO

### Необходимо реализовать

- [ ] Остальные страницы (Collections, Product, Cart, Checkout, Track)
- [ ] Admin панель полностью
- [ ] API интеграция (заменить mock данные)
- [ ] Реальные изображения товаров
- [ ] Аутентификация пользователей
- [ ] Платежная система
- [ ] Email уведомления
- [ ] SMS уведомления
- [ ] Карта для доставки (Google Maps / Yandex Maps)
- [ ] Real-time обновления заказов (WebSocket)
- [ ] Отзывы и рейтинги
- [ ] Фильтры и сортировки
- [ ] Поиск по каталогу
- [ ] Избранное
- [ ] История заказов
- [ ] Промокоды и скидки

### Будущие улучшения

- [ ] 3D визуализация букетов (react-three-fiber)
- [ ] AR примерка (Web AR)
- [ ] AI рекомендации букетов
- [ ] Чат с флористом
- [ ] Видео обзоры букетов
- [ ] Подписка на доставку
- [ ] Корпоративные заказы
- [ ] Gift cards

## 🤝 Contributing

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 License

MIT License - см. файл LICENSE

## 👥 Авторы

- **Design & Development** — Ваше имя
- **Client** — Цветочная лавка, г. Мирный, г. Якутск

## 📞 Контакты

- Email: info@florale.ru
- Телефон: +7 (XXX) XXX-XX-XX
- Telegram: @florale_yakutsk
