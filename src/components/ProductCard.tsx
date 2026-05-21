import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import { formatPrice } from '@/lib/products'

type ProductCardProps = {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-canary/30 h-full flex flex-col">
        {/* Combo ribbon */}
        {product.isCombo && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className="bg-canary text-racing-green text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full "
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              BEST VALUE
            </span>
          </div>
        )}

        {/* Badge */}
        {!product.isCombo && (
          <div className="absolute top-4 right-4 z-10">
            <span
              className="bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              {product.badge}
            </span>
          </div>
        )}
        {product.isCombo && (
          <div className="absolute top-4 right-4 z-10">
            <span
              className="bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Image */}
        <div className="relative h-64 sm:h-72 bg-gradient-to-b from-dark-fern/20 to-transparent overflow-hidden">
          {product.isCombo && product.images ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Back shirt — shifted right */}
              <div className="absolute w-[55%] h-[85%] right-[8%] top-[7%] transition-transform duration-500 group-hover:translate-x-1">
                <Image src={product.images[1]} alt="2025 Shirt" fill className="object-contain drop-shadow-[4px_4px_12px_rgba(0,0,0,0.6)]" />
              </div>
              {/* Front shirt — shifted left, on top */}
              <div className="absolute w-[55%] h-[85%] left-[8%] top-[7%] z-10 transition-transform duration-500 group-hover:-translate-x-1">
                <Image src={product.images[0]} alt="Classic Shirt" fill className="object-contain drop-shadow-[-4px_4px_12px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-2">
            <p
              className="text-asparagus text-xs font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              {product.subtitle}
            </p>
            <h3
              className="text-white text-xl font-bold uppercase tracking-wide leading-tight group-hover:text-canary transition-colors duration-300"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              {product.name}
            </h3>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              {product.originalPrice && (
                <p className="text-gray-500 text-sm line-through">{formatPrice(product.originalPrice)}</p>
              )}
              <p
                className="text-canary text-xl font-bold tracking-widest"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                {formatPrice(product.price)}
              </p>
              {product.savings && (
                <p className="text-green-400 text-xs font-bold">Save {formatPrice(product.savings)}</p>
              )}
            </div>

            {/* CTA */}
            <span
              className="bg-white/10 border border-white/20 text-white text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-xl group-hover:bg-canary group-hover:text-racing-green group-hover:border-canary transition-all duration-300"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
