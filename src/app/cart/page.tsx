'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cartContext'
import { getProductById, formatPrice, DELIVERY_CHARGE, prepaidPrice } from '@/lib/products'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, totalItems, subtotal, total } = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05110a] via-[#0b1f13] to-[#040806] relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-dark-fern/20 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <div className="relative z-10 pt-40 sm:pt-48 pb-24 px-4 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-canary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Cart</span>
        </nav>

        <h1
          className="text-5xl sm:text-6xl font-black uppercase tracking-widest text-white mb-2"
          style={{ fontFamily: '"din-condensed", sans-serif' }}
        >
          Your <span className="text-canary">Cart</span>
        </h1>

        {cart.length === 0 ? (
          /* Empty state */
          <div className="text-center py-32">
            <div className="mb-6 flex justify-center">
              <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2
              className="text-3xl font-black uppercase tracking-widest text-white mb-4"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 mb-10">Add some shirts to get started.</p>
            <Link
              href="/"
              className="inline-block bg-canary text-racing-green font-bold uppercase tracking-widest py-4 px-10 rounded-xl hover:bg-canary/90 transition-all duration-300"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <p className="text-gray-400 text-sm mb-6">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
              {cart.map((item) => {
                const product = getProductById(item.productId)
                if (!product) return null
                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex items-start gap-5 hover:border-white/30 transition-all duration-200"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-dark-fern/20 rounded-xl overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-white font-bold uppercase tracking-wide text-sm leading-tight mb-1"
                        style={{ fontFamily: '"din-condensed", sans-serif' }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-asparagus text-xs font-bold uppercase tracking-widest mb-3" style={{ fontFamily: '"din-condensed", sans-serif' }}>
                        Size: {item.size}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-sm font-bold flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-sm font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <span
                        className="text-canary font-bold text-sm"
                        style={{ fontFamily: '"din-condensed", sans-serif' }}
                      >
                        {formatPrice((product.price ?? 0) * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sticky top-36">
                <h2
                  className="text-xl font-black uppercase tracking-widest text-white mb-6"
                  style={{ fontFamily: '"din-condensed", sans-serif' }}
                >
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cart.map((item) => {
                    const product = getProductById(item.productId)
                    if (!product) return null
                    return (
                      <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                        <span className="text-gray-400 truncate max-w-[70%]">
                          {product.name} ({item.size}) ×{item.quantity}
                        </span>
                        <span className="text-canary font-bold text-xs flex-shrink-0 ml-2" style={{ fontFamily: '"din-condensed", sans-serif' }}>
                          {formatPrice(product.price * item.quantity)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-white/10 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery</span>
                    <span className="text-white font-bold">{formatPrice(DELIVERY_CHARGE)}</span>
                  </div>
                  <div className="flex justify-between text-base border-t border-white/10 pt-2 mt-2">
                    <span className="text-white font-black uppercase tracking-widest" style={{ fontFamily: '"din-condensed", sans-serif' }}>Total</span>
                    <span className="text-canary font-black text-lg" style={{ fontFamily: '"din-condensed", sans-serif' }}>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Prepaid savings teaser */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-green-400 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: '"din-condensed", sans-serif' }}>5% Prepaid Discount Available</p>
                    <p className="text-gray-400 text-xs mt-0.5">Choose prepaid at checkout &amp; save <span className="text-white font-bold">{formatPrice(subtotal - prepaidPrice(subtotal))}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-[#f3f754] hover:bg-[#f3f754]/90 text-[#05110a] font-black uppercase tracking-widest transition-all duration-300 mb-3"
                  style={{ fontFamily: '"din-condensed", sans-serif' }}
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/"
                  className="block w-full text-center py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
