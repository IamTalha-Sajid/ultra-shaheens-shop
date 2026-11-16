import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/products'

export default function ShopHome() {
  return (
    <div className="font-sans min-h-screen bg-ink-dark text-paper">
      <Header />

      {/* Hero */}
      <section className="px-[clamp(20px,4vw,48px)] pt-[clamp(56px,8vw,112px)] pb-[clamp(48px,6vw,80px)]">
        <div className="wrap flex flex-col gap-7">
          <div className="eyebrow text-canary">Official merchandise</div>
          <h1 className="m-0 font-display font-extrabold uppercase text-[clamp(56px,10.5vw,156px)] leading-[0.86] tracking-[-0.005em]">
            Ultra Shaheens
            <br />
            <span className="text-canary">Official Shop</span>
          </h1>
          <div className="flex flex-wrap items-end justify-between gap-7">
            <p className="m-0 max-w-[460px] text-[clamp(17px,1.5vw,20px)] leading-[1.5] text-paper/[0.86]">
              Wear your passion. Support Pakistan football. Every shirt tells the story of the most
              dedicated fans in the game.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#products" className="btn btn-primary">
                Shop the collection
              </a>
              <Link href="/order-status" className="btn btn-secondary">
                Track an order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Offers bar */}
      <div className="bg-canary text-ink-dark">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center gap-x-8 gap-y-2 px-[clamp(20px,4vw,48px)] py-4 font-display font-bold uppercase tracking-[0.08em] text-[17px]">
          <span className="bg-ink-dark text-canary px-2.5 py-1 text-[13px] tracking-[0.16em]">Offers</span>
          <span>Buy the COCO 2026 shirt &amp; get the iWEAR Classic for Rs. 1,499 · Save Rs. 700</span>
          <span>Delivery Rs. 299 nationwide</span>
          <span>Prepaid orders get 5% off</span>
        </div>
      </div>

      {/* Products */}
      <section id="products" className="section-pad bg-paper text-ink">
        <div className="wrap flex flex-col gap-[clamp(40px,5vw,64px)]">
          <div className="split gap-x-16 gap-y-6 items-end">
            <div className="flex flex-col gap-[18px]">
              <div className="eyebrow text-green-accent">The collection</div>
              <h2 className="h2-display">
                Rep the green
                <br />
                and white.
              </h2>
            </div>
            <p className="m-0 text-lg leading-[1.6] text-body-light max-w-[520px]">
              Official merchandise of Ultra Shaheens, Pakistan&apos;s most passionate football
              community.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-8 gap-y-14">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
