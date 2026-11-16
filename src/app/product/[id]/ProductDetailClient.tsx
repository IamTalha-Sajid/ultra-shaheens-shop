'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/products'
import { formatPrice, prepaidPrice } from '@/lib/products'
import SizeSelector from '@/components/SizeSelector'
import SizeChartModal from '@/components/SizeChartModal'
import { useCart } from '@/lib/cartContext'

type Props = {
  product: Product
}

const IWEAR_SIZE_CHART = '/images/size-charts/iwear.png'
const COCO_SIZE_CHART = '/images/size-charts/coco.png'

const SizeHeading = ({ title, onChart }: { title: string; onChart: () => void }) => (
  <div className="flex items-center justify-between gap-3">
    <p className="m-0 label text-paper">{title}</p>
    <button
      type="button"
      onClick={onChart}
      className="px-3 py-2 border border-paper/40 font-display font-semibold text-[13px] tracking-[0.14em] uppercase text-paper hover:bg-paper hover:text-ink-dark transition-colors cursor-pointer"
    >
      Size chart
    </button>
  </div>
)

export default function ProductDetailClient({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [comboClassicSize, setComboClassicSize] = useState<string | null>(null)
  const [comboNewSize, setComboNewSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [sizeChartOpen, setSizeChartOpen] = useState(false)
  const [activeSizeChart, setActiveSizeChart] = useState(
    product.id === 'new-shirt' ? COCO_SIZE_CHART : IWEAR_SIZE_CHART
  )

  const { addToCart } = useCart()

  const images = product.images ?? [product.image]

  const openSizeChart = (chartImage: string) => {
    setActiveSizeChart(chartImage)
    setSizeChartOpen(true)
  }

  const canAddToCart = product.isCombo
    ? Boolean(comboClassicSize && comboNewSize)
    : Boolean(selectedSize)

  const handleAddToCart = () => {
    if (!canAddToCart) return
    const size = product.isCombo
      ? `Classic (iWEAR): ${comboClassicSize} / New (COCO): ${comboNewSize}`
      : selectedSize!
    addToCart(product.id, size, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-16 gap-y-12 items-start">
      {/* Images */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square bg-paper-2 overflow-hidden">
          {product.isCombo && images.length > 1 ? (
            <div className="absolute inset-0">
              <div className="absolute w-[58%] h-[72%] right-[4%] top-[14%]">
                <Image src={images[1]} alt="2026 Shirt" fill sizes="(min-width: 1024px) 320px, 50vw" className="object-contain" priority />
              </div>
              <div className="absolute w-[58%] h-[72%] left-[4%] top-[14%] z-10">
                <Image src={images[0]} alt="Classic Shirt" fill sizes="(min-width: 1024px) 320px, 50vw" className="object-contain" priority />
              </div>
            </div>
          ) : (
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-contain p-[8%]"
              priority
            />
          )}
          {product.isCombo && (
            <span className="absolute top-5 left-5 z-20 bg-canary text-ink-dark px-3 py-1.5 font-display font-bold text-[13px] tracking-[0.14em] uppercase">
              Best value
            </span>
          )}
        </div>
        {/* Thumbnails — only for single-image products */}
        {!product.isCombo && images.length > 1 && (
          <div className="flex gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(idx)}
                aria-label={`View ${idx + 1}`}
                className={`relative w-24 h-24 bg-paper-2 border-2 cursor-pointer ${
                  activeImage === idx ? 'border-canary' : 'border-transparent hover:border-paper/50'
                }`}
              >
                <Image src={img} alt="" fill sizes="96px" className="object-contain p-2" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-paper/40 px-3 py-1.5 font-display font-semibold text-[13px] tracking-[0.14em] uppercase">
              {product.badge}
            </span>
            <span className="eyebrow text-canary !text-[13px]">{product.subtitle}</span>
          </div>
          <h1 className="m-0 font-display font-extrabold uppercase text-[clamp(40px,5vw,72px)] leading-[0.9]">
            {product.name}
          </h1>
          <p className="m-0 text-[17px] leading-[1.6] text-paper/[0.78]">{product.description}</p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2 py-5 border-y border-paper/20">
          {product.originalPrice && (
            <span className="text-base text-paper/50 line-through">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="font-display font-extrabold text-[clamp(44px,5vw,64px)] leading-[0.9] text-canary">
            {formatPrice(product.price)}
          </span>
          {product.savings && (
            <span className="text-sm font-semibold text-canary">You save {formatPrice(product.savings)}</span>
          )}
          <span className="text-sm text-paper/60">+ Rs. 299 delivery charge</span>
          <p className="m-0 mt-2 text-sm text-paper/[0.78]">
            <strong className="text-paper font-semibold">Prepaid order?</strong> Pay in advance and get it for
            only <strong className="text-canary font-semibold">{formatPrice(prepaidPrice(product.price))}</strong>, 5% off.
          </p>
          {product.discountNote && (
            <div className="mt-2 pt-3 border-t border-paper/20">
              <p className="m-0 label text-canary">Special offer</p>
              <p className="m-0 mt-1 text-sm text-paper/[0.78]">{product.discountNote}</p>
            </div>
          )}
        </div>

        {/* Size Selector */}
        {product.isCombo ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <SizeHeading title="Classic Shirt (iWEAR) — Size" onChart={() => openSizeChart(IWEAR_SIZE_CHART)} />
              <SizeSelector sizes={product.sizes} selected={comboClassicSize} onSelect={setComboClassicSize} />
            </div>
            <div className="flex flex-col gap-3">
              <SizeHeading title="New Shirt (COCO) — Size" onChart={() => openSizeChart(COCO_SIZE_CHART)} />
              <SizeSelector sizes={product.sizes} selected={comboNewSize} onSelect={setComboNewSize} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SizeHeading title="Select size" onChart={() => openSizeChart(activeSizeChart)} />
            <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
          </div>
        )}

        <SizeChartModal
          open={sizeChartOpen}
          onClose={() => setSizeChartOpen(false)}
          chartImage={activeSizeChart}
          productName={product.name}
        />

        {/* Quantity */}
        <div className="flex flex-col gap-3">
          <p className="m-0 label text-paper">Quantity</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="stepper-btn"
            >
              −
            </button>
            <span className="w-14 text-center font-display font-bold text-2xl">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="stepper-btn"
            >
              +
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className={`btn w-full ${addedToCart ? 'bg-paper text-ink-dark' : 'btn-primary'}`}
        >
          {addedToCart ? '✓ Added to cart' : 'Add to cart'}
        </button>

        {/* Trust indicators */}
        <ul className="m-0 p-0 list-none pt-6 border-t border-paper/20 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
          {['Authentic official merch', 'Made for Pakistan fans', 'Supporting Pakistan football'].map((text) => (
            <li key={text} className="flex items-center gap-2.5 text-sm text-paper/70">
              <span className="w-1.5 h-1.5 bg-canary flex-none" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
