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
    <Link href={`/product/${product.id}`} className="group flex flex-col h-full">
      <div className="relative aspect-square bg-paper-2 overflow-hidden">
        {product.isCombo && (
          <span className="absolute top-4 left-4 z-20 bg-canary text-ink-dark px-3 py-1.5 font-display font-bold text-[13px] tracking-[0.14em] uppercase">
            Best value
          </span>
        )}
        <span className="absolute top-4 right-4 z-20 bg-ink-dark text-paper px-3 py-1.5 font-display font-semibold text-[13px] tracking-[0.14em] uppercase">
          {product.badge}
        </span>

        {product.isCombo && product.images ? (
          <div className="absolute inset-0">
            <div className="absolute w-[55%] h-[75%] right-[6%] top-[14%] transition-transform duration-500 group-hover:translate-x-1">
              <Image
                src={product.images[1]}
                alt="2026 Shirt"
                fill
                sizes="(min-width: 1024px) 200px, 40vw"
                className="object-contain"
              />
            </div>
            <div className="absolute w-[55%] h-[75%] left-[6%] top-[14%] z-10 transition-transform duration-500 group-hover:-translate-x-1">
              <Image
                src={product.images[0]}
                alt="Classic Shirt"
                fill
                sizes="(min-width: 1024px) 200px, 40vw"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-contain p-[10%] transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 gap-3 pt-5">
        <div className="eyebrow text-green-accent !text-[13px]">{product.subtitle}</div>
        <h3 className="m-0 font-display font-extrabold uppercase text-[30px] leading-[0.95] text-ink">
          {product.name}
        </h3>
        <p className="m-0 text-[15px] leading-[1.55] text-body-light flex-1">{product.description}</p>

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-ink/20">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-sm text-muted-light line-through">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="font-display font-bold text-[28px] leading-none text-ink">
              {formatPrice(product.price)}
            </span>
            {product.savings && (
              <span className="mt-1 text-[13px] font-semibold text-green-accent">
                Save {formatPrice(product.savings)}
              </span>
            )}
          </div>
          <span className="btn btn-dark group-hover:bg-green-accent !px-5 !py-3 !text-base">View →</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
