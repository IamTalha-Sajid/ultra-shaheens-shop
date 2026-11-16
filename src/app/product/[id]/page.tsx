import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { products, getProductById, formatPrice } from '@/lib/products'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailClient from './ProductDetailClient'

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) notFound()

  const related = products.filter((p) => p.id !== product.id).slice(0, 2)

  return (
    <div className="font-sans min-h-screen bg-ink-dark text-paper">
      <Header />

      <div className="page-pad">
        <div className="wrap">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2.5 mb-10 label text-paper/60">
            <Link href="/" className="hover:text-canary">Shop</Link>
            <span>/</span>
            <span className="text-paper">{product.name}</span>
          </nav>

          <ProductDetailClient product={product} />

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-[clamp(72px,9vw,120px)] pt-8 border-t border-paper/20 flex flex-col gap-8">
              <h2 className="m-0 font-display font-extrabold uppercase text-[clamp(36px,4.4vw,56px)] leading-[0.9]">
                You might also like
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-8">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/product/${rel.id}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-[4/3] bg-paper-2 overflow-hidden">
                      {rel.isCombo && rel.images ? (
                        <div className="absolute inset-0">
                          <div className="absolute w-[50%] h-[80%] right-[8%] top-[10%]">
                            <Image src={rel.images[1]} alt="2026 Shirt" fill sizes="200px" className="object-contain" />
                          </div>
                          <div className="absolute w-[50%] h-[80%] left-[8%] top-[10%] z-10">
                            <Image src={rel.images[0]} alt="Classic Shirt" fill sizes="200px" className="object-contain" />
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={rel.image}
                          alt={rel.name}
                          fill
                          sizes="(min-width: 1024px) 380px, 100vw"
                          className="object-contain p-[6%] transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="eyebrow text-canary !text-[13px]">{rel.subtitle}</span>
                      <span className="font-display font-extrabold uppercase text-[28px] leading-none group-hover:text-canary">
                        {rel.name}
                      </span>
                      <span className="font-display font-semibold text-lg text-paper/80">
                        {formatPrice(rel.price)} →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
