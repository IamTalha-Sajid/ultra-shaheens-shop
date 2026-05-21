'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { formatPrice } from '@/lib/products'

type OrderStatus = 'pending' | 'processing' | 'dispatched' | 'cancelled'

type OrderResult = {
  orderId: string
  status: OrderStatus
  paymentMethod: 'cod' | 'prepaid'
  customer: { name: string; city: string }
  items: { productName: string; size: string; quantity: number; lineTotal: number }[]
  subtotal: number
  deliveryCharge: number
  prepaidDiscount: number
  total: number
  createdAt: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; description: string }> = {
  pending: {
    label: 'Payment Pending',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    description: 'Awaiting payment confirmation. Please transfer the amount to the NayaPay account.',
  },
  processing: {
    label: 'Processing',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    description: 'Your order is confirmed and is being prepared for dispatch.',
  },
  dispatched: {
    label: 'Dispatched',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    description: 'Your order is on its way! Expect delivery within 3–5 business days.',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    description: 'This order has been cancelled. Contact us on WhatsApp if you have questions.',
  },
}

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Payment' },
  { key: 'processing', label: 'Processing' },
  { key: 'dispatched', label: 'Dispatched' },
]

function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-red-400 text-sm font-semibold">Order Cancelled</span>
      </div>
    )
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status)

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx
        const active = idx === currentIdx
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? 'bg-emerald-500 border-emerald-500'
                  : active
                  ? 'bg-[#f3f754]/20 border-[#f3f754]'
                  : 'bg-white/5 border-white/20'
              }`}>
                {done ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-[#f3f754]' : 'bg-white/20'}`} />
                )}
              </div>
              <span className={`text-[10px] font-semibold text-center ${
                active ? 'text-[#f3f754]' : done ? 'text-emerald-400' : 'text-gray-500'
              }`}>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-5 ${idx < currentIdx ? 'bg-emerald-500' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function OrderStatusPage() {
  return (
    <Suspense>
      <OrderStatusContent />
    </Suspense>
  )
}

function OrderStatusContent() {
  const searchParams = useSearchParams()
  const [input, setInput] = useState(searchParams.get('id') ?? '')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<OrderResult | null>(null)
  const [error, setError] = useState('')

  const lookup = async (id: string) => {
    const trimmed = id.trim().toUpperCase()
    if (!trimmed) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(trimmed)}`)
      if (res.status === 404) {
        setError('No order found with that ID. Please double-check and try again.')
      } else if (!res.ok) {
        setError('Something went wrong. Please try again.')
      } else {
        const data = await res.json() as OrderResult
        setOrder(data)
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-lookup if ID comes from URL param
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) void lookup(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void lookup(input)
  }

  const cfg = order ? STATUS_CONFIG[order.status] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05110a] via-[#0b1f13] to-[#040806] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-dark-fern/20 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <div className="relative z-10 pt-40 sm:pt-48 pb-24 px-4 max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-canary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Track Order</span>
        </nav>

        <h1
          className="text-5xl sm:text-6xl font-black uppercase tracking-widest text-white mb-3"
          style={{ fontFamily: '"din-condensed", sans-serif' }}
        >
          Track <span className="text-canary">Order</span>
        </h1>
        <p className="text-gray-400 text-sm mb-10">Enter your order ID to check the current status of your order.</p>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. US-20260521-A3K9"
            className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f3f754]/50 focus:bg-white/10 transition-all font-mono text-sm uppercase"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-[#f3f754] hover:bg-[#f3f754]/90 text-[#05110a] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : 'Track'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Order result */}
        {order && cfg && (
          <div className="space-y-4">
            {/* Status card */}
            <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono text-lg font-bold text-white">{order.orderId}</p>
                </div>
                <span className={`${cfg.bg} ${cfg.color} border ${cfg.border} rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-sm text-gray-300">{cfg.description}</p>
            </div>

            {/* Progress tracker */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <StatusTracker status={order.status} />
            </div>

            {/* Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Order Details</p>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Customer</span>
                <span className="text-white font-medium">{order.customer.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">City</span>
                <span className="text-white font-medium">{order.customer.city}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment</span>
                <span className="text-white font-medium">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Placed</span>
                <span className="text-white font-medium">{new Date(order.createdAt).toLocaleString('en-PK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.productName} ({item.size}) ×{item.quantity}</span>
                    <span className="text-canary font-bold text-xs">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.prepaidDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Prepaid discount</span><span>− {formatPrice(order.prepaidDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Delivery</span><span>{formatPrice(order.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-canary" style={{ fontFamily: '"din-condensed", sans-serif' }}>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
