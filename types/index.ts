// types/index.ts

export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  rating: number
  reviewsCount: number
  images: string[]
  category: string
  collection?: string
  sizes: ProductSize[]
  colors: string[]
  composition: FlowerComposition[]
  care: string[]
  inStock: boolean
  featured?: boolean
}

export interface ProductSize {
  id: string
  name: string
  flowersCount: string
  price: number
  height: string
}

export interface FlowerComposition {
  name: string
  count: number
  icon?: string
}

export interface Collection {
  id: string
  name: string
  description: string
  image: string
  productsCount: number
  season?: string
  occasion?: string
  featured?: boolean
}

export interface Story {
  id: string
  collectionId: string
  image: string
  title: string
  subtitle?: string
  gradient: string
}

export interface CartItem {
  productId: string
  product: Product
  size: ProductSize
  quantity: number
  packaging?: PackagingOption
  cardMessage?: string
  cardDesign?: string
}

export interface PackagingOption {
  id: string
  name: string
  price: number
  image: string
  ribbonColors?: string[]
}

export interface BouquetConfig {
  style: string
  colorPalette: string
  size: ProductSize
  packaging: PackagingOption
  ribbonColor?: string
  cardMessage?: string
  cardDesign?: string
  price: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  items: CartItem[]
  recipient: Recipient
  delivery: DeliveryInfo
  payment: PaymentInfo
  total: number
  createdAt: string
  updatedAt: string
  timeline: OrderTimeline[]
  floristId?: string
  courierId?: string
  pointId: string
}

export type OrderStatus = 
  | 'new' 
  | 'processing' 
  | 'ready' 
  | 'courier_assigned' 
  | 'in_delivery' 
  | 'delivered' 
  | 'cancelled'

export interface Recipient {
  name: string
  phone: string
  isSender?: boolean
}

export interface DeliveryInfo {
  address: string
  date: string
  time: string
  urgent?: boolean
  courier?: {
    id: string
    name: string
    phone: string
    photo?: string
    rating: number
  }
}

export interface PaymentInfo {
  method: 'online' | 'card_courier' | 'cash'
  status: 'pending' | 'paid' | 'failed'
  amount: number
}

export interface OrderTimeline {
  status: OrderStatus
  timestamp: string
  message: string
  image?: string
}

export interface Florist {
  id: string
  name: string
  photo?: string
  rating: number
  activeOrders: number
  pointId: string
}

export interface Point {
  id: string
  name: string
  address: string
  phone: string
  workingHours: string
}

export interface AdminMetrics {
  todayOrders: {
    count: number
    amount: number
  }
  processing: {
    count: number
  }
  weekCompleted: {
    count: number
    graph: number[]
  }
  averageCheck: {
    amount: number
    change: number
  }
}

export interface BuilderStep {
  id: number
  title: string
  completed: boolean
}

export const BUILDER_STEPS: BuilderStep[] = [
  { id: 1, title: 'Стиль', completed: false },
  { id: 2, title: 'Цвет', completed: false },
  { id: 3, title: 'Размер', completed: false },
  { id: 4, title: 'Упаковка', completed: false },
  { id: 5, title: 'Открытка', completed: false },
  { id: 6, title: 'Итог', completed: false },
]

export const BOUQUET_STYLES = [
  { id: 'classic', name: 'Классика', image: '/images/styles/classic.jpg' },
  { id: 'mono', name: 'Монобукет', image: '/images/styles/mono.jpg' },
  { id: 'field', name: 'Полевой', image: '/images/styles/field.jpg' },
  { id: 'exotic', name: 'Экзотика', image: '/images/styles/exotic.jpg' },
  { id: 'mix', name: 'Микс', image: '/images/styles/mix.jpg' },
]

export const COLOR_PALETTES = [
  { id: 'pastel', name: 'Пастель', colors: ['#FFE4E1', '#E8D5D5', '#F5E6E8'] },
  { id: 'bright', name: 'Яркие', colors: ['#FF6B9D', '#FFA500', '#FF0000'] },
  { id: 'white', name: 'Белые', colors: ['#FFFFFF', '#FFFAF0', '#F8F8FF'] },
  { id: 'dark', name: 'Темные', colors: ['#4B0082', '#8B0000', '#2F4F4F'] },
  { id: 'rainbow', name: 'Радуга', colors: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'] },
]

export const PACKAGING_OPTIONS: PackagingOption[] = [
  { id: 'kraft', name: 'Крафт', price: 200, image: '/images/packaging/kraft.jpg', ribbonColors: ['#D2691E', '#8B4513', '#A0522D'] },
  { id: 'film', name: 'Пленка', price: 150, image: '/images/packaging/film.jpg', ribbonColors: ['#FFB6C1', '#DDA0DD', '#E0B0FF'] },
  { id: 'hatbox', name: 'Шляпная коробка', price: 500, image: '/images/packaging/hatbox.jpg' },
  { id: 'basket', name: 'Корзина', price: 400, image: '/images/packaging/basket.jpg' },
  { id: 'none', name: 'Без упаковки', price: 0, image: '/images/packaging/none.jpg' },
]

export const CARD_DESIGNS = [
  { id: 'classic', name: 'Классика', image: '/images/cards/classic.jpg' },
  { id: 'minimal', name: 'Минимализм', image: '/images/cards/minimal.jpg' },
  { id: 'floral', name: 'Цветочная', image: '/images/cards/floral.jpg' },
  { id: 'watercolor', name: 'Акварель', image: '/images/cards/watercolor.jpg' },
]
