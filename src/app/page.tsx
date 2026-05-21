import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/products'

export default function ShopHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05110a] via-[#0b1f13] to-[#040806] relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-dark-fern/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-la-palma/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      {/* Hero Section */}
      <section className="relative z-10 pt-40 sm:pt-48 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-asparagus text-sm font-bold uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            Official Merchandise
          </p>
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-widest text-white mb-4 leading-none"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            ULTRA{' '}
            <span className="text-canary">
              SHAHEENS
            </span>
          </h1>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-widest text-white/80 mb-8"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            SHOP
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Wear your passion. Support Pakistan football. Every shirt tells the story of the most
            dedicated fans in the game.
          </p>

          {/* Section divider diamond */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <div className="h-px bg-gradient-to-r from-transparent to-canary/40 flex-1 max-w-32" />
            <div className="w-3 h-3 bg-canary rotate-45 shadow-[0_0_12px_rgba(243,247,84,0.6)]" />
            <div className="h-px bg-gradient-to-l from-transparent to-canary/40 flex-1 max-w-32" />
          </div>
        </div>
      </section>

      {/* Running Promo Banner */}
      <div className="relative z-10 w-full overflow-hidden bg-canary/10 border-y border-canary/20 py-3 backdrop-blur-sm">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-8 text-canary text-sm font-bold uppercase tracking-widest flex-shrink-0"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9.172V5a2 2 0 012-2z" /></svg>
              <span>Special Offer: Buy the COCO 2026 Shirt &amp; get the iWEAR Classic for only Rs. 1,499 — Save Rs. 700!</span>
              <svg className="w-3 h-3 flex-shrink-0 text-canary/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <span>Delivery: Rs. 299 nationwide</span>
              <svg className="w-3 h-3 flex-shrink-0 text-canary/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Prepaid orders get 5% off!</span>
              <svg className="w-3 h-3 flex-shrink-0 text-canary/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </span>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section className="relative z-10 px-4 pb-24 mt-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </section>

      <Footer />
    </div>
  )
}
