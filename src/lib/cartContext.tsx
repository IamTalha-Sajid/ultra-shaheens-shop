'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { getProductById, formatPrice, DELIVERY_CHARGE, prepaidPrice } from './products'

export type CartItem = {
  productId: string
  size: string
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (productId: string, size: string, quantity: number) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  total: number
  getWhatsAppMessage: () => string
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = useCallback((productId: string, size: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.size === size)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { productId, size, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)))
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)))
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size ? { ...i, quantity } : i
        )
      )
    }
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  const subtotal = cart.reduce((sum, i) => {
    const product = getProductById(i.productId)
    return sum + (product?.price ?? 0) * i.quantity
  }, 0)

  const total = subtotal + (cart.length > 0 ? DELIVERY_CHARGE : 0)

  const getWhatsAppMessage = useCallback(() => {
    if (cart.length === 0) return ''
    const lines = cart.map((item) => {
      const product = getProductById(item.productId)
      const name = product?.name ?? item.productId
      const lineTotal = (product?.price ?? 0) * item.quantity
      return `- ${name} (Size: ${item.size}) x${item.quantity} = ${formatPrice(lineTotal)}`
    })
    const sub = cart.reduce((s, i) => {
      const p = getProductById(i.productId)
      return s + (p?.price ?? 0) * i.quantity
    }, 0)
    return encodeURIComponent(
      `Hello! I'd like to order from Ultra Shaheens:\n${lines.join('\n')}\n\nSubtotal: ${formatPrice(sub)}\nDelivery: ${formatPrice(DELIVERY_CHARGE)}\nTotal: ${formatPrice(sub + DELIVERY_CHARGE)}\n\n(Prepaid total with 5% off: ${formatPrice(prepaidPrice(sub) + DELIVERY_CHARGE)})`
    )
  }, [cart])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, total, getWhatsAppMessage }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
