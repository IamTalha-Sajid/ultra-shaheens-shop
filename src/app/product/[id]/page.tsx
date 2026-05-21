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
    <div className="min-h-screen bg-gradient-to-br from-[#05110a] via-[#0b1f13] to-[#040806] relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-dark-fern/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-la-palma/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <div className="relative z-10 pt-40 sm:pt-48 pb-24 px-4 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-canary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <ProductDetailClient product={product} />

        {/* Section divider */}
        <div className="flex items-center gap-4 my-20">
          <div className="h-px bg-gradient-to-r from-transparent to-canary/30 flex-1" />
          <div className="w-3 h-3 bg-canary rotate-45 shadow-[0_0_12px_rgba(243,247,84,0.6)]" />
          <div className="h-px bg-gradient-to-l from-transparent to-canary/30 flex-1" />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2
              className="text-3xl font-black uppercase tracking-widest text-white mb-8 text-center"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {related.map((rel) => (
                <Link key={rel.id} href={`/product/${rel.id}`} className="group block">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-canary/30 hover:scale-[1.02] transition-all duration-300">
                    <div className="relative h-48 bg-dark-fern/20">
                      {rel.isCombo && rel.images ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute w-[55%] h-[85%] right-[8%] top-[7%]">
                            <Image src={rel.images[1]} alt="2026 Shirt" fill className="object-contain drop-shadow-[4px_4px_10px_rgba(0,0,0,0.6)]" />
                          </div>
                          <div className="absolute w-[55%] h-[85%] left-[8%] top-[7%] z-10">
                            <Image src={rel.images[0]} alt="Classic Shirt" fill className="object-contain drop-shadow-[-4px_4px_10px_rgba(0,0,0,0.6)]" />
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={rel.image}
                          alt={rel.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <p
                        className="text-asparagus text-xs font-bold uppercase tracking-widest mb-1"
                        style={{ fontFamily: '"din-condensed", sans-serif' }}
                      >
                        {rel.subtitle}
                      </p>
                      <h3
                        className="text-white font-bold uppercase tracking-wide group-hover:text-canary transition-colors"
                        style={{ fontFamily: '"din-condensed", sans-serif' }}
                      >
                        {rel.name}
                      </h3>
                      <p className="text-canary text-sm font-bold mt-2" style={{ fontFamily: '"din-condensed", sans-serif' }}>
                        {formatPrice(rel.price)} →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}
