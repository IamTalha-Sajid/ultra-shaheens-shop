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

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; border: string; description: string }> = {
  pending: {
    label: 'Payment pending',
    color: 'text-amber-300',
    border: 'border-amber-400',
    description: 'Awaiting payment confirmation. Please transfer the amount to the NayaPay account.',
  },
  processing: {
    label: 'Processing',
    color: 'text-canary',
    border: 'border-canary',
    description: 'Your order is confirmed and is being prepared for dispatch.',
  },
  dispatched: {
    label: 'Dispatched',
    color: 'text-emerald-300',
    border: 'border-emerald-400',
    description: 'Your order is on its way! Expect delivery within 3–5 business days.',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-300',
    border: 'border-red-400',
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
      <p className="m-0 border-l-4 border-red-400 bg-red-400/10 px-4 py-3 text-red-300 text-sm font-semibold">
        Order cancelled
      </p>
    )
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status)

  return (
    <div className="flex items-start gap-2">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx
        const active = idx === currentIdx
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-2 flex-none min-w-0">
              <div
                className={`w-9 h-9 flex items-center justify-center border-2 font-display font-bold text-sm ${
                  done
                    ? 'bg-canary border-canary text-ink-dark'
                    : active
                    ? 'border-canary text-canary'
                    : 'border-paper/30 text-paper/40'
                }`}
              >
                {done ? '✓' : idx + 1}
              </div>
              <span
                className={`label !text-[12px] text-center ${
                  active ? 'text-canary' : done ? 'text-paper' : 'text-paper/50'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mt-[17px] ${idx < currentIdx ? 'bg-canary' : 'bg-paper/20'}`} />
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
    <div className="font-sans min-h-screen bg-ink-dark text-paper flex flex-col">
      <Header />

      <div className="page-pad flex-1">
        <div className="max-w-[720px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <nav className="flex items-center gap-2.5 label text-paper/60">
              <Link href="/" className="hover:text-canary">Shop</Link>
              <span>/</span>
              <span className="text-paper">Track order</span>
            </nav>
            <h1 className="h1-page">
              Track <span className="text-canary">order</span>
            </h1>
            <p className="m-0 text-lg text-paper/[0.78]">
              Enter your order ID to check the current status of your order.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="order-id" className="sr-only">Order ID</label>
            <input
              id="order-id"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. US-20260521-A3K9"
              className="field flex-1 font-mono text-sm uppercase"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary !py-[13px]">
              {loading ? 'Searching…' : 'Track'}
            </button>
          </form>

          {error && (
            <p className="m-0 border-l-4 border-red-400 bg-red-400/10 px-4 py-3 text-red-300 text-sm">{error}</p>
          )}

          {/* Order result */}
          {order && cfg && (
            <div className="flex flex-col gap-8">
              {/* Status */}
              <div className={`border-l-4 ${cfg.border} bg-paper/5 px-5 py-5 flex flex-col gap-3`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="m-0 label text-paper/60">Order ID</p>
                    <p className="m-0 mt-1 font-mono text-lg font-bold break-all">{order.orderId}</p>
                  </div>
                  <span className={`label ${cfg.color}`}>{cfg.label}</span>
                </div>
                <p className="m-0 text-[15px] text-paper/[0.78]">{cfg.description}</p>
              </div>

              <StatusTracker status={order.status} />

              {/* Details */}
              <div className="flex flex-col gap-5">
                <p className="m-0 label text-paper/60">Order details</p>

                <div className="flex flex-col border-t border-paper/20">
                  {[
                    { k: 'Customer', v: order.customer.name },
                    { k: 'City', v: order.customer.city },
                    { k: 'Payment', v: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid' },
                    {
                      k: 'Placed',
                      v: new Date(order.createdAt).toLocaleString('en-PK', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    },
                  ].map((row) => (
                    <div key={row.k} className="flex justify-between gap-4 py-3 border-b border-paper/20 text-[15px]">
                      <span className="text-paper/60">{row.k}</span>
                      <span className="font-semibold text-right">{row.v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col border-t border-paper/20">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between gap-4 py-3 border-b border-paper/20 text-[15px]">
                      <span className="text-paper/[0.78]">
                        {item.productName} ({item.size}) ×{item.quantity}
                      </span>
                      <span className="font-semibold flex-none">{formatPrice(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 text-[15px]">
                  <div className="flex justify-between text-paper/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.prepaidDiscount > 0 && (
                    <div className="flex justify-between text-canary">
                      <span>Prepaid discount</span>
                      <span>− {formatPrice(order.prepaidDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-paper/70">
                    <span>Delivery</span>
                    <span>{formatPrice(order.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-paper/20">
                    <span className="label">Total</span>
                    <span className="font-display font-extrabold text-[36px] leading-none text-canary">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
