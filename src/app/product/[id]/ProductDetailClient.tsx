'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/products'
import { formatPrice, DELIVERY_CHARGE, prepaidPrice } from '@/lib/products'
import SizeSelector from '@/components/SizeSelector'
import SizeChartModal from '@/components/SizeChartModal'
import { useCart } from '@/lib/cartContext'

type Props = {
  product: Product
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [sizeChartOpen, setSizeChartOpen] = useState(false)

  const sizeChartImage = product.id === 'new-shirt'
    ? '/size-chart-coco.jpeg'
    : '/size-chart-iwear.jpeg'
  const { addToCart } = useCart()

  const images = product.images ?? [product.image]

  const handleAddToCart = () => {
    if (!selectedSize) return
    addToCart(product.id, selectedSize, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const lineTotal = product.price * quantity

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* Images */}
      <div className="space-y-4">
        <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden aspect-square">
          {product.isCombo && images.length > 1 ? (
            /* Overlapping combo layout */
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Back shirt — right side */}
              <div className="absolute w-[58%] h-[80%] right-[5%] top-[10%]">
                <Image src={images[1]} alt="2025 Shirt" fill className="object-contain drop-shadow-[6px_6px_18px_rgba(0,0,0,0.7)]" priority />
              </div>
              {/* Front shirt — left side, on top */}
              <div className="absolute w-[58%] h-[80%] left-[5%] top-[10%] z-10">
                <Image src={images[0]} alt="Classic Shirt" fill className="object-contain drop-shadow-[-6px_6px_18px_rgba(0,0,0,0.7)]" priority />
              </div>
            </div>
          ) : (
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
          )}
          {product.isCombo && (
            <div className="absolute top-4 left-4 z-20">
              <span
                className="bg-canary text-racing-green text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                BEST VALUE
              </span>
            </div>
          )}
        </div>
        {/* Thumbnails — only for single-image products */}
        {!product.isCombo && images.length > 1 && (
          <div className="flex gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                  activeImage === idx ? 'border-canary' : 'border-white/20 hover:border-white/40'
                }`}
              >
                <Image src={img} alt={`View ${idx + 1}`} fill className="object-contain p-2" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Badge + subtitle */}
        <div className="flex items-center gap-3">
          <span
            className="bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            {product.badge}
          </span>
          <span className="text-asparagus text-sm font-bold uppercase tracking-widest" style={{ fontFamily: '"din-condensed", sans-serif' }}>
            {product.subtitle}
          </span>
        </div>

        {/* Name */}
        <h1
          className="text-4xl sm:text-5xl font-black uppercase tracking-wide text-white leading-tight"
          style={{ fontFamily: '"din-condensed", sans-serif' }}
        >
          {product.name}
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-base leading-relaxed">{product.description}</p>

        {/* Price */}
        <div className="bg-canary/10 border border-canary/20 rounded-2xl px-6 py-4 space-y-1">
          {product.originalPrice && (
            <p className="text-gray-500 text-base line-through">{formatPrice(product.originalPrice)}</p>
          )}
          <p
            className="text-canary text-3xl font-black tracking-widest"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            {formatPrice(product.price)}
          </p>
          {product.savings && (
            <p className="text-green-400 text-sm font-bold">You save {formatPrice(product.savings)}</p>
          )}
          <p className="text-gray-400 text-xs pt-1">+ Rs. 299 delivery charge</p>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-green-400 text-xs font-bold">
              Prepaid order? Pay in advance &amp; get it for only <span className="text-white">{formatPrice(prepaidPrice(product.price))}</span> — 5% off!
            </p>
          </div>
          {product.discountNote && (
            <div className="mt-3 pt-3 border-t border-canary/20">
              <p className="text-canary/80 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: '"din-condensed", sans-serif' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9.172V5a2 2 0 012-2z" /></svg>
                Special Offer
              </p>
              <p className="text-gray-300 text-sm mt-1">{product.discountNote}</p>
            </div>
          )}
        </div>

        {/* Size Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p
              className="text-white font-bold uppercase tracking-widest text-sm"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              Select Size
            </p>
            <button
              onClick={() => setSizeChartOpen(true)}
              className="flex items-center gap-1.5 text-xs text-canary hover:text-canary/80 font-bold uppercase tracking-wider transition-colors border border-canary/30 hover:border-canary/60 px-3 py-1 rounded-lg bg-canary/5 hover:bg-canary/10"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Size Chart
            </button>
          </div>
          <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
        </div>

        <SizeChartModal
          open={sizeChartOpen}
          onClose={() => setSizeChartOpen(false)}
          chartImage={sizeChartImage}
          productName={product.name}
        />

        {/* Quantity Selector */}
        <div className="space-y-3">
          <p
            className="text-white font-bold uppercase tracking-widest text-sm"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            Quantity
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-lg font-bold flex items-center justify-center"
            >
              −
            </button>
            <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-lg font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`flex-1 py-4 px-8 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 ${
              selectedSize
                ? addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-canary text-racing-green hover:bg-canary/90'
                : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
            }`}
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>

        {/* Trust indicators */}
        <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4">
          {[
            {
              icon: <svg className="w-4 h-4 text-canary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
              text: 'Authentic Official Merch',
            },
            {
              icon: <svg className="w-4 h-4 text-canary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
              text: 'Made for Pakistan Fans',
            },
            {
              icon: <svg className="w-4 h-4 text-canary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
              text: 'Supporting Pakistan Football',
            },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              {item.icon}
              <span className="text-gray-400 text-xs">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
