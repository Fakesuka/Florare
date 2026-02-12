// store/admin.ts

import { create } from 'zustand'
import type { Order, OrderStatus } from '@/types'

interface AdminStore {
  orders: Order[]
  selectedPoint: string
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  assignFlorist: (orderId: string, floristId: string) => void
  assignCourier: (orderId: string, courierId: string) => void
  setSelectedPoint: (pointId: string) => void
  getOrdersByPoint: (pointId: string) => Order[]
  getOrdersByStatus: (status: OrderStatus, pointId?: string) => Order[]
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  orders: [],
  selectedPoint: 'mirny',

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }))
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...order.timeline,
                {
                  status,
                  timestamp: new Date().toISOString(),
                  message: getStatusMessage(status),
                },
              ],
            }
          : order
      ),
    }))
  },

  assignFlorist: (orderId, floristId) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, floristId, updatedAt: new Date().toISOString() }
          : order
      ),
    }))
  },

  assignCourier: (orderId, courierId) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, courierId, updatedAt: new Date().toISOString() }
          : order
      ),
    }))
  },

  setSelectedPoint: (pointId) => set({ selectedPoint: pointId }),

  getOrdersByPoint: (pointId) => {
    return get().orders.filter((order) => order.pointId === pointId)
  },

  getOrdersByStatus: (status, pointId) => {
    const orders = get().orders
    const filtered = pointId
      ? orders.filter((order) => order.pointId === pointId)
      : orders
    return filtered.filter((order) => order.status === status)
  },
}))

function getStatusMessage(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    new: 'Заказ оформлен',
    processing: 'Флорист начал работу над букетом',
    ready: 'Букет готов',
    courier_assigned: 'Курьер назначен',
    in_delivery: 'Заказ в пути',
    delivered: 'Заказ доставлен',
    cancelled: 'Заказ отменен',
  }
  return messages[status]
}
