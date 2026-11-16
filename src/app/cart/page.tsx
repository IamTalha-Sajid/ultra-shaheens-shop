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
    <div className="font-sans min-h-screen bg-ink-dark text-paper flex flex-col">
      <Header />

      <div className="page-pad flex-1">
        <div className="wrap flex flex-col gap-[clamp(32px,4vw,56px)]">
          <div className="flex flex-col gap-5">
            <nav className="flex items-center gap-2.5 label text-paper/60">
              <Link href="/" className="hover:text-canary">Shop</Link>
              <span>/</span>
              <span className="text-paper">Cart</span>
            </nav>
            <h1 className="h1-page">
              Your <span className="text-canary">Cart</span>
            </h1>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-start gap-6 py-10 border-t border-paper/20">
              <h2 className="m-0 font-display font-extrabold uppercase text-[clamp(32px,4vw,48px)] leading-none">
                Your cart is empty
              </h2>
              <p className="m-0 text-lg text-paper/70">Add some shirts to get started.</p>
              <Link href="/" className="btn btn-primary">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-x-16 gap-y-12 items-start">
              {/* Cart items */}
              <div className="flex flex-col">
                <p className="m-0 pb-4 label text-paper/60">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
                </p>
                <div className="flex flex-col border-t border-paper/20">
                  {cart.map((item) => {
                    const product = getProductById(item.productId)
                    if (!product) return null
                    return (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="grid grid-cols-[88px_minmax(0,1fr)_auto] gap-x-5 gap-y-3 py-6 border-b border-paper/20 items-start"
                      >
                        <div className="relative w-[88px] h-[88px] bg-paper-2">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="88px"
                            className="object-contain p-2"
                          />
                        </div>

                        <div className="min-w-0 flex flex-col gap-1.5">
                          <h3 className="m-0 font-display font-extrabold uppercase text-[22px] leading-none">
                            {product.name}
                          </h3>
                          <p className="m-0 label text-canary !tracking-[0.12em] break-words">
                            Size: {item.size}
                          </p>
                        </div>

                        <span className="font-display font-bold text-[22px] leading-none whitespace-nowrap">
                          {formatPrice((product.price ?? 0) * item.quantity)}
                        </span>

                        <div className="col-span-3 sm:col-span-2 sm:col-start-2 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="stepper-btn"
                            >
                              −
                            </button>
                            <span className="w-12 text-center font-display font-bold text-xl">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="stepper-btn"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.size)}
                            aria-label="Remove item"
                            className="h-11 px-1 label text-paper/60 underline underline-offset-4 hover:text-canary cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-paper text-ink p-[clamp(24px,3vw,32px)] flex flex-col gap-6 lg:sticky lg:top-28">
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
                  <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-ink/20">
                    <span className="label text-ink">Total</span>
                    <span className="font-display font-extrabold text-[32px] leading-none">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="border border-ink/30 px-4 py-3">
                  <p className="m-0 label text-green-accent">5% prepaid discount available</p>
                  <p className="m-0 mt-1 text-sm text-body-light">
                    Choose prepaid at checkout and save{' '}
                    <strong className="text-ink">{formatPrice(subtotal - prepaidPrice(subtotal))}</strong>.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button type="button" onClick={() => router.push('/checkout')} className="btn btn-dark w-full">
                    Proceed to checkout
                  </button>
                  <Link
                    href="/"
                    className="text-center text-sm text-muted-light underline underline-offset-4 hover:text-green-accent"
                  >
                    Continue shopping
                  </Link>
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
