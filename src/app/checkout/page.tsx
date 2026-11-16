'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cartContext'
import { getProductById, formatPrice, DELIVERY_CHARGE, PREPAID_DISCOUNT_PCT } from '@/lib/products'

type PaymentMethod = 'cod' | 'prepaid'

type OrderSuccess = {
  orderId: string
  status: string
  paymentMethod: PaymentMethod
  customerName: string
  customerEmail: string
  items: { productName: string; size: string; quantity: number; lineTotal: number }[]
  subtotal: number
  prepaidDiscount: number
  total: number
}

const BANK_DETAILS = [
  { label: 'Bank', value: 'NayaPay', mono: false },
  { label: 'Account name', value: 'Usama Mushtaq Bhutta', mono: false },
  { label: 'Account no', value: '03359169165', mono: true },
  { label: 'IBAN', value: 'PK16NAYA1234503359169165', mono: true },
]

const BankDetails = ({ tone }: { tone: 'dark' | 'light' }) => (
  <div className="flex flex-col">
    {BANK_DETAILS.map((row) => (
      <div
        key={row.label}
        className={`flex justify-between gap-4 py-2.5 border-b text-[15px] ${
          tone === 'dark' ? 'border-paper/20' : 'border-ink/20'
        }`}
      >
        <span className={`flex-none ${tone === 'dark' ? 'text-paper/60' : 'text-muted-light'}`}>{row.label}</span>
        <span className={`font-semibold text-right break-all ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
      </div>
    ))}
  </div>
)

const SixHourWarning = () => (
  <p className="m-0 border-l-4 border-red-400 bg-red-400/10 px-4 py-3 text-sm text-red-300">
    Payment must be received within <strong className="text-paper">6 hours</strong> of placing the order, or it
    will be cancelled automatically.
  </p>
)

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, subtotal, clearCart } = useCart()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccess | null>(null)
  const [copied, setCopied] = useState(false)

  // Redirect if cart is empty (only when no success state)
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push('/')
    }
  }, [cart, router, orderSuccess])

  if (cart.length === 0 && !orderSuccess) return null

  const prepaidDiscount = paymentMethod === 'prepaid' ? Math.round(subtotal * PREPAID_DISCOUNT_PCT / 100) : 0
  const discountedSubtotal = subtotal - prepaidDiscount
  const total = discountedSubtotal + DELIVERY_CHARGE

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Full name is required'
    if (!email.trim()) errors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address'
    if (!phone.trim()) errors.phone = 'Phone number is required'
    if (!address.trim()) errors.address = 'Street address is required'
    if (!city.trim()) errors.city = 'City is required'
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)

    try {
      const items = cart.map((item) => {
        const product = getProductById(item.productId)
        const unitPrice = product?.price ?? 0
        return {
          productId: item.productId,
          productName: product?.name ?? item.productId,
          size: item.size,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        }
      })

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim(), address: address.trim(), city: city.trim() },
          items,
          subtotal,
          deliveryCharge: DELIVERY_CHARGE,
          prepaidDiscount,
          total,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      clearCart()
      setOrderSuccess({
        orderId: data.orderId,
        status: data.status,
        paymentMethod,
        customerName: name.trim(),
        customerEmail: email.trim(),
        items: items,
        subtotal,
        prepaidDiscount,
        total,
      })
    } catch {
      setError('Network error. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  const copyOrderId = async (id: string) => {
    await navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = (field: string) => `field${fieldErrors[field] ? ' field-error' : ''}`

  if (orderSuccess) {
    const isPrepaid = orderSuccess.paymentMethod === 'prepaid'
    return (
      <div className="font-sans min-h-screen bg-ink-dark text-paper flex flex-col">
        <Header />
        <div className="page-pad flex-1">
          <div className="max-w-[720px] mx-auto flex flex-col gap-8">
            {/* Success header */}
            <div className="flex flex-col gap-5">
              <div className="eyebrow flex items-center gap-3 text-canary">
                <span className="w-2 h-2 bg-canary" />
                Order received
              </div>
              <h1 className="h1-page">
                Order <span className="text-canary">placed!</span>
              </h1>
              <p className="m-0 text-lg text-paper/[0.78]">
                Thanks, {orderSuccess.customerName}. Your order has been received.
              </p>
            </div>

            {/* Order ID */}
            <div className="border-y border-paper/20 py-6 flex flex-col gap-3">
              <p className="m-0 label text-paper/60">Your order ID</p>
              <div className="flex items-center gap-4 flex-wrap">
                <p className="m-0 font-mono text-2xl sm:text-3xl font-bold flex-1 min-w-0 break-all">
                  {orderSuccess.orderId}
                </p>
                <button
                  type="button"
                  onClick={() => void copyOrderId(orderSuccess.orderId)}
                  className="min-w-[88px] h-11 border border-paper/40 font-display font-bold text-sm tracking-[0.14em] uppercase hover:bg-paper hover:text-ink-dark cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="m-0 text-sm text-paper/60">Save this ID. You can use it to track your order at any time.</p>
            </div>

            {/* Email notice */}
            <div className="border border-paper/20 px-5 py-4">
              <p className="m-0 label text-canary">Invoice sent to your email</p>
              <p className="m-0 mt-1.5 text-sm text-paper/[0.78]">
                A full invoice with order details and tracking instructions has been sent to{' '}
                <strong className="text-paper font-semibold break-all">{orderSuccess.customerEmail}</strong>.
              </p>
            </div>

            {/* Prepaid payment instructions */}
            {isPrepaid && (
              <div className="bg-canary text-ink-dark p-[clamp(20px,3vw,32px)] flex flex-col gap-4">
                <p className="m-0 label">Action required — complete your payment</p>
                <BankDetails tone="light" />
                <div className="flex justify-between items-baseline pt-1">
                  <span className="label">Amount to pay</span>
                  <span className="font-display font-extrabold text-[36px] leading-none">
                    {formatPrice(orderSuccess.total)}
                  </span>
                </div>
                <SixHourWarning />
              </div>
            )}

            {/* Order summary */}
            <div className="flex flex-col gap-4">
              <p className="m-0 label text-paper/60">Order summary</p>
              <div className="flex flex-col border-t border-paper/20">
                {orderSuccess.items.map((item, i) => (
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
                  <span>{formatPrice(orderSuccess.subtotal)}</span>
                </div>
                {orderSuccess.prepaidDiscount > 0 && (
                  <div className="flex justify-between text-canary">
                    <span>Prepaid discount (5%)</span>
                    <span>− {formatPrice(orderSuccess.prepaidDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-paper/70">
                  <span>Delivery</span>
                  <span>{formatPrice(DELIVERY_CHARGE)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-paper/20">
                  <span className="label">Total</span>
                  <span className="font-display font-extrabold text-[36px] leading-none text-canary">
                    {formatPrice(orderSuccess.total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-paper/60 pt-1">
                  <span>Payment</span>
                  <span>{orderSuccess.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (Bank Transfer)'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/order-status?id=${orderSuccess.orderId}`} className="btn btn-primary">
                Track this order
              </Link>
              <Link href="/" className="btn btn-secondary">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="font-sans min-h-screen bg-ink-dark text-paper flex flex-col">
      <Header />

      <div className="page-pad flex-1">
        <div className="wrap flex flex-col gap-[clamp(32px,4vw,56px)]">
          <div className="flex flex-col gap-5">
            <nav className="flex items-center gap-2.5 label text-paper/60">
              <Link href="/" className="hover:text-canary">Shop</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-canary">Cart</Link>
              <span>/</span>
              <span className="text-paper">Checkout</span>
            </nav>
            <h1 className="h1-page">
              Check<span className="text-canary">out</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-16 gap-y-12 items-start">
              {/* LEFT: Order summary */}
              <div className="flex flex-col gap-8">
                <div className="bg-paper text-ink p-[clamp(24px,3vw,32px)] flex flex-col gap-6">
                  <h2 className="m-0 font-display font-extrabold uppercase text-[32px] leading-none">
                    Order summary
                  </h2>

                  <div className="flex flex-col gap-2.5">
                    {cart.map((item) => {
                      const product = getProductById(item.productId)
                      if (!product) return null
                      return (
                        <div key={`${item.productId}-${item.size}`} className="flex justify-between gap-3 text-sm">
                          <span className="text-body-light min-w-0 break-words">
                            {product.name} ({item.size}) ×{item.quantity}
                          </span>
                          <span className="font-semibold flex-none">{formatPrice(product.price * item.quantity)}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4 border-t-[1.5px] border-ink flex flex-col gap-2">
                    <div className="flex justify-between text-[15px]">
                      <span className="text-body-light">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[15px]">
                      <span className="text-body-light">Delivery</span>
                      <span className="font-semibold">{formatPrice(DELIVERY_CHARGE)}</span>
                    </div>
                    {paymentMethod === 'prepaid' && prepaidDiscount > 0 && (
                      <div className="flex justify-between text-[15px] text-green-accent">
                        <span>Prepaid discount ({PREPAID_DISCOUNT_PCT}%)</span>
                        <span className="font-semibold">−{formatPrice(prepaidDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-ink/20">
                      <span className="label text-ink">Total</span>
                      <span className="font-display font-extrabold text-[32px] leading-none">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Prepaid bank details */}
                {paymentMethod === 'prepaid' && (
                  <div className="flex flex-col gap-4 border border-canary p-[clamp(20px,3vw,28px)]">
                    <p className="m-0 label text-canary">Transfer payment to</p>
                    <BankDetails tone="dark" />
                    <SixHourWarning />
                    <p className="m-0 text-sm text-paper/70">
                      After transfer, send the screenshot to WhatsApp:{' '}
                      <a
                        href="https://wa.me/923247749121"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-canary font-semibold underline underline-offset-4 hover:text-white"
                      >
                        +92 324 7749121
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT: Customer details */}
              <div className="flex flex-col gap-7">
                <h2 className="m-0 font-display font-extrabold uppercase text-[32px] leading-none">
                  Your details
                </h2>

                {/* Payment method */}
                <div className="flex flex-col gap-3">
                  <p className="m-0 label text-paper/70">Payment method</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        {
                          key: 'cod' as const,
                          title: 'COD',
                          text: 'Pay when your order arrives',
                          chip: 'Standard',
                          chipClass: 'bg-paper/10 text-paper/70',
                        },
                        {
                          key: 'prepaid' as const,
                          title: 'Prepaid',
                          text: `Pay in advance & save ${PREPAID_DISCOUNT_PCT}%`,
                          chip: `Save ${formatPrice(Math.round(subtotal * PREPAID_DISCOUNT_PCT / 100))}`,
                          chipClass: 'bg-canary text-ink-dark',
                        },
                      ]
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setPaymentMethod(opt.key)}
                        aria-pressed={paymentMethod === opt.key}
                        className={`p-4 border-2 text-left cursor-pointer transition-colors ${
                          paymentMethod === opt.key
                            ? 'border-canary bg-canary/10'
                            : 'border-paper/30 hover:border-paper/60'
                        }`}
                      >
                        <span className="block font-display font-extrabold uppercase text-2xl leading-none mb-2">
                          {opt.title}
                        </span>
                        <span className="block text-[13px] leading-snug text-paper/70">{opt.text}</span>
                        <span
                          className={`inline-block mt-3 px-2 py-1 font-display font-bold text-[11px] tracking-[0.14em] uppercase ${opt.chipClass}`}
                        >
                          {opt.chip}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="label text-paper/70">Full name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: '' })) }}
                      placeholder="e.g. Ahmed Khan"
                      className={inputClass('name')}
                    />
                    {fieldErrors.name && <p className="m-0 text-red-300 text-sm">{fieldErrors.name}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="label text-paper/70">Email address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                      placeholder="you@example.com"
                      className={inputClass('email')}
                    />
                    {fieldErrors.email && <p className="m-0 text-red-300 text-sm">{fieldErrors.email}</p>}
                    <p className="m-0 text-paper/50 text-[13px]">Your order invoice will be sent here.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="label text-paper/70">Phone number</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: '' })) }}
                      placeholder="03XX-XXXXXXX"
                      className={inputClass('phone')}
                    />
                    {fieldErrors.phone && <p className="m-0 text-red-300 text-sm">{fieldErrors.phone}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="address" className="label text-paper/70">Street address</label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setFieldErrors((p) => ({ ...p, address: '' })) }}
                      placeholder="House No, Street, Area"
                      className={inputClass('address')}
                    />
                    {fieldErrors.address && <p className="m-0 text-red-300 text-sm">{fieldErrors.address}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="label text-paper/70">City</label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => { setCity(e.target.value); setFieldErrors((p) => ({ ...p, city: '' })) }}
                      placeholder="e.g. Karachi"
                      className={inputClass('city')}
                    />
                    {fieldErrors.city && <p className="m-0 text-red-300 text-sm">{fieldErrors.city}</p>}
                  </div>
                </div>

                {error && (
                  <p className="m-0 border-l-4 border-red-400 bg-red-400/10 px-4 py-3 text-red-300 text-sm">{error}</p>
                )}

                <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                  {submitting ? 'Placing order…' : 'Place order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
