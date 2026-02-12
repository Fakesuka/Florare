// app/admin/page.tsx

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Package,
  MapPin,
} from 'lucide-react'
import { STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/motion'
import { formatPrice, formatDateTime } from '@/lib/utils'

// Mock данные
const metrics = {
  todayOrders: { count: 24, amount: 127500 },
  processing: { count: 8 },
  weekCompleted: { count: 156, graph: [18, 22, 25, 19, 27, 24, 21] },
  averageCheck: { amount: 5312, change: 12.5 },
}

const recentOrders = [
  {
    id: 'FL-001234',
    status: 'new',
    customer: 'Анна Иванова',
    total: 4500,
    time: new Date().toISOString(),
    point: 'mirny',
  },
  {
    id: 'FL-001235',
    status: 'processing',
    customer: 'Михаил Петров',
    total: 7200,
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    point: 'yakutsk',
  },
  {
    id: 'FL-001236',
    status: 'ready',
    customer: 'Ольга Сидорова',
    total: 3800,
    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    point: 'mirny',
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[rgb(var(--accent-cream))]">
      {/* Header */}
      <header className="glass border-b border-[rgb(var(--neutral-warm))] safe-area-inset-top">
        <div className="container mx-auto px-4 py-6">
          <h1 className="heading-3">Панель управления</h1>
          <p className="text-sm text-[rgb(var(--text-dark))]/60">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Metrics */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <MetricCard
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Заказы сегодня"
            value={metrics.todayOrders.count.toString()}
            subtitle={formatPrice(metrics.todayOrders.amount)}
            color="rose"
          />
          <MetricCard
            icon={<Clock className="h-6 w-6" />}
            title="В обработке"
            value={metrics.processing.count.toString()}
            subtitle="Требуют внимания"
            color="orange"
          />
          <MetricCard
            icon={<CheckCircle className="h-6 w-6" />}
            title="Выполнено за неделю"
            value={metrics.weekCompleted.count.toString()}
            subtitle="↑ 12% к прошлой неделе"
            color="green"
          />
          <MetricCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Средний чек"
            value={formatPrice(metrics.averageCheck.amount)}
            subtitle={`↑ ${metrics.averageCheck.change}%`}
            color="blue"
          />
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 font-serif text-2xl font-semibold">Быстрые действия</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/point-mirny">
              <QuickActionCard
                icon={<MapPin className="h-8 w-8" />}
                title="Мирный"
                subtitle="Управление заказами"
                color="rose"
              />
            </Link>
            <Link href="/admin/point-yakutsk">
              <QuickActionCard
                icon={<MapPin className="h-8 w-8" />}
                title="Якутск Центр"
                subtitle="Управление заказами"
                color="rose"
              />
            </Link>
            <QuickActionCard
              icon={<Package className="h-8 w-8" />}
              title="Каталог"
              subtitle="Управление товарами"
              color="sage"
            />
            <QuickActionCard
              icon={<Users className="h-8 w-8" />}
              title="Курьеры"
              subtitle="На линии: 5"
              color="olive"
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="mb-4 font-serif text-2xl font-semibold">Недавние заказы</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, title, value, subtitle, color }: any) {
  const colors = {
    rose: 'bg-[rgb(var(--primary-rose))]/10 text-[rgb(var(--primary-rose))]',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    sage: 'bg-[rgb(var(--primary-sage))]/10 text-[rgb(var(--primary-sage))]',
    olive: 'bg-[rgb(var(--primary-olive))]/10 text-[rgb(var(--primary-olive))]',
  }

  return (
    <motion.div
      variants={STAGGER_ITEM}
      className="rounded-2xl bg-white p-6 shadow-md"
    >
      <div className={`mb-4 inline-flex rounded-full p-3 ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-medium text-[rgb(var(--text-dark))]/60">
        {title}
      </h3>
      <div className="mb-1 text-3xl font-bold">{value}</div>
      <p className="text-sm text-[rgb(var(--text-dark))]/60">{subtitle}</p>
    </motion.div>
  )
}

function QuickActionCard({ icon, title, subtitle, color }: any) {
  const colors = {
    rose: 'bg-[rgb(var(--primary-rose))]/10 text-[rgb(var(--primary-rose))]',
    sage: 'bg-[rgb(var(--primary-sage))]/10 text-[rgb(var(--primary-sage))]',
    olive: 'bg-[rgb(var(--primary-olive))]/10 text-[rgb(var(--primary-olive))]',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="cursor-pointer rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
    >
      <div className={`mb-3 inline-flex rounded-full p-3 ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="mb-1 font-serif text-lg font-semibold">{title}</h3>
      <p className="text-sm text-[rgb(var(--text-dark))]/60">{subtitle}</p>
    </motion.div>
  )
}

function OrderCard({ order }: any) {
  const statusConfig = {
    new: { label: 'Новый', color: 'bg-blue-100 text-blue-700' },
    processing: { label: 'В работе', color: 'bg-orange-100 text-orange-700' },
    ready: { label: 'Готов', color: 'bg-green-100 text-green-700' },
    delivered: { label: 'Доставлен', color: 'bg-gray-100 text-gray-700' },
  }

  const status = statusConfig[order.status as keyof typeof statusConfig]
  const point = order.point === 'mirny' ? 'Мирный' : 'Якутск'

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md">
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{order.id}</span>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
          <span className="rounded-full bg-[rgb(var(--accent-cream))] px-2 py-1 text-xs">
            {point}
          </span>
        </div>
        <div className="text-sm text-[rgb(var(--text-dark))]/60">
          {order.customer} • {formatDateTime(order.time)}
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-[rgb(var(--primary-rose))]">
          {formatPrice(order.total)}
        </div>
      </div>
    </div>
  )
}
