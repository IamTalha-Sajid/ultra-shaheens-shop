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

  const inputClass = (field: string) =>
    `bg-white/5 border ${fieldErrors[field] ? 'border-red-400/50 bg-red-400/5' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f3f754]/50 focus:bg-white/10 transition-all w-full`

  if (orderSuccess) {
    const isPrepaid = orderSuccess.paymentMethod === 'prepaid'
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#05110a] via-[#0b1f13] to-[#040806] relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-dark-fern/20 rounded-full blur-[120px] pointer-events-none" />
        <Header />
        <div className="relative z-10 pt-40 sm:pt-48 pb-24 px-4 max-w-2xl mx-auto">

          {/* Success header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 mb-5">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1
              className="text-5xl sm:text-6xl font-black uppercase tracking-widest text-white mb-2"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              Order <span className="text-canary">Placed!</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Thanks, {orderSuccess.customerName}. Your order has been received.
            </p>
          </div>

          {/* Order ID card */}
          <div className="bg-white/5 border border-white/15 rounded-2xl p-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Your Order ID</p>
            <div className="flex items-center gap-3">
              <p className="font-mono text-2xl font-black text-white flex-1">{orderSuccess.orderId}</p>
              <button
                onClick={() => void copyOrderId(orderSuccess.orderId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white hover:bg-white/20 transition-all"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Save this ID — you can use it to track your order at any time.
            </p>
          </div>

          {/* Email confirmation notice */}
          <div className="flex items-start gap-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl px-4 py-4 mb-4">
            <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-white">Invoice sent to your email</p>
              <p className="text-xs text-gray-400 mt-0.5">
                A full invoice with order details and tracking instructions has been sent to <span className="text-indigo-300 font-medium">{orderSuccess.customerEmail}</span>.
              </p>
            </div>
          </div>

          {/* Prepaid payment instructions */}
          {isPrepaid && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Action Required — Complete Your Payment</p>
              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="text-white font-medium">NayaPay</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Account Name</span><span className="text-white font-medium">Usama Mushtaq Bhutta</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Account No</span><span className="text-white font-mono font-medium">03359169165</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-400 flex-shrink-0">IBAN</span><span className="text-white font-mono font-medium text-right break-all">PK16NAYA1234503359169165</span></div>
                <div className="flex justify-between font-bold border-t border-white/10 pt-2 mt-2"><span className="text-amber-400">Amount to Pay</span><span className="text-amber-400">{formatPrice(orderSuccess.total)}</span></div>
              </div>
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-xs text-red-400">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                <span>Payment must be received within <strong className="text-white">6 hours</strong> or your order will be cancelled automatically.</span>
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Order Summary</p>
            <div className="space-y-1.5 mb-3">
              {orderSuccess.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.productName} ({item.size}) ×{item.quantity}</span>
                  <span className="text-canary font-bold text-xs">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatPrice(orderSuccess.subtotal)}</span></div>
              {orderSuccess.prepaidDiscount > 0 && (
                <div className="flex justify-between text-emerald-400"><span>Prepaid discount (5%)</span><span>− {formatPrice(orderSuccess.prepaidDiscount)}</span></div>
              )}
              <div className="flex justify-between text-gray-400"><span>Delivery</span><span>{formatPrice(DELIVERY_CHARGE)}</span></div>
              <div className="flex justify-between font-bold border-t border-white/10 pt-2 text-base">
                <span className="text-white">Total</span>
                <span className="text-canary" style={{ fontFamily: '"din-condensed", sans-serif' }}>{formatPrice(orderSuccess.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 pt-1">
                <span>Payment</span>
                <span className="capitalize">{orderSuccess.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (Bank Transfer)'}</span>
              </div>
            </div>
          </div>

          {/* Track order CTA */}
          <Link
            href={`/order-status?id=${orderSuccess.orderId}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/5 border border-white/15 text-gray-300 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Track this order
          </Link>

          <Link
            href="/"
            className="block w-full text-center py-3 text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            Continue shopping →
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05110a] via-[#0b1f13] to-[#040806] relative overflow-hidden">
      {/* Ambient orb */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-dark-fern/20 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <div className="relative z-10 pt-40 sm:pt-48 pb-24 px-4 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-canary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-canary transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-white">Checkout</span>
        </nav>

        <h1
          className="text-5xl sm:text-6xl font-black uppercase tracking-widest text-white mb-10"
          style={{ fontFamily: '"din-condensed", sans-serif' }}
        >
          Check<span className="text-canary">out</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* LEFT: Order Summary */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                <h2
                  className="text-xl font-black uppercase tracking-widest text-white mb-6"
                  style={{ fontFamily: '"din-condensed", sans-serif' }}
                >
                  Order Summary
                </h2>

                {/* Item list */}
                <div className="space-y-3 mb-6">
                  {cart.map((item) => {
                    const product = getProductById(item.productId)
                    if (!product) return null
                    return (
                      <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                        <span className="text-gray-400 truncate max-w-[65%]">
                          {product.name} ({item.size}) ×{item.quantity}
                        </span>
                        <span
                          className="text-canary font-bold text-xs flex-shrink-0 ml-2"
                          style={{ fontFamily: '"din-condensed", sans-serif' }}
                        >
                          {formatPrice(product.price * item.quantity)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery</span>
                    <span className="text-white font-bold">{formatPrice(DELIVERY_CHARGE)}</span>
                  </div>
                  {paymentMethod === 'prepaid' && prepaidDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400 font-medium">Prepaid discount ({PREPAID_DISCOUNT_PCT}%)</span>
                      <span className="text-green-400 font-bold">−{formatPrice(prepaidDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base border-t border-white/10 pt-2 mt-2">
                    <span
                      className="text-white font-black uppercase tracking-widest"
                      style={{ fontFamily: '"din-condensed", sans-serif' }}
                    >
                      Total
                    </span>
                    <span
                      className="text-canary font-black text-lg"
                      style={{ fontFamily: '"din-condensed", sans-serif' }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prepaid bank details */}
              {paymentMethod === 'prepaid' && (
                <div className="bg-white/5 backdrop-blur-xl border border-[#f3f754]/40 rounded-3xl p-6">
                  <p
                    className="text-[#f3f754] font-black uppercase tracking-widest text-sm mb-4"
                    style={{ fontFamily: '"din-condensed", sans-serif' }}
                  >
                    Transfer Payment To:
                  </p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank</span>
                      <span className="text-white font-medium">NayaPay</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Name</span>
                      <span className="text-white font-medium">Usama Mushtaq Bhutta</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 flex-shrink-0">Account No</span>
                      <span className="text-white font-medium font-mono">03359169165</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 flex-shrink-0">IBAN</span>
                      <span className="text-white font-medium font-mono text-right break-all">PK16NAYA1234503359169165</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-3 mb-3">
                    <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                    <p className="text-red-400 text-xs font-medium">If payment is not received within <span className="font-bold text-white">6 hours</span> of placing the order, it will be cancelled automatically.</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-gray-400 text-xs">
                      After transfer, send screenshot to WhatsApp:{' '}
                      <a
                        href="https://wa.me/923247749121"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f3f754] font-medium hover:underline"
                      >
                        +92 324 7749121
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Customer Details */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 space-y-6">
              <h2
                className="text-xl font-black uppercase tracking-widest text-white"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                Your Details
              </h2>

              {/* Payment method selection */}
              <div>
                <label className="text-white/70 text-sm font-medium mb-3 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      paymentMethod === 'cod'
                        ? 'border-[#f3f754] bg-[#f3f754]/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {/* Truck icon */}
                      <svg className="w-5 h-5 text-white/80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 8h4l3 5v3h-7V8z" />
                      </svg>
                      <span className="text-white font-bold text-sm" style={{ fontFamily: '"din-condensed", sans-serif' }}>COD</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-snug">Pay when your order arrives</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-wider">Standard</span>
                  </button>

                  {/* Prepaid */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('prepaid')}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      paymentMethod === 'prepaid'
                        ? 'border-[#f3f754] bg-[#f3f754]/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {/* Shield check icon */}
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-white font-bold text-sm" style={{ fontFamily: '"din-condensed", sans-serif' }}>Prepaid</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-snug">Pay in advance &amp; save {PREPAID_DISCOUNT_PCT}%</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                      Save {formatPrice(Math.round(subtotal * PREPAID_DISCOUNT_PCT / 100))}
                    </span>
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm font-medium mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: '' })) }}
                    placeholder="e.g. Ahmed Khan"
                    className={inputClass('name')}
                  />
                  {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="text-white/70 text-sm font-medium mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                    placeholder="you@example.com"
                    className={inputClass('email')}
                  />
                  {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                  <p className="text-gray-500 text-xs mt-1">Your order invoice will be sent here.</p>
                </div>

                <div>
                  <label className="text-white/70 text-sm font-medium mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: '' })) }}
                    placeholder="03XX-XXXXXXX"
                    className={inputClass('phone')}
                  />
                  {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="text-white/70 text-sm font-medium mb-1.5 block">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setFieldErrors((p) => ({ ...p, address: '' })) }}
                    placeholder="House No, Street, Area"
                    className={inputClass('address')}
                  />
                  {fieldErrors.address && <p className="text-red-400 text-xs mt-1">{fieldErrors.address}</p>}
                </div>

                <div>
                  <label className="text-white/70 text-sm font-medium mb-1.5 block">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setFieldErrors((p) => ({ ...p, city: '' })) }}
                    placeholder="e.g. Karachi"
                    className={inputClass('city')}
                  />
                  {fieldErrors.city && <p className="text-red-400 text-xs mt-1">{fieldErrors.city}</p>}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-[#f3f754] hover:bg-[#f3f754]/90 text-[#05110a] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                {submitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
