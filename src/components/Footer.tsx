import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', href: '/' },
      { label: 'Classic Shirt', href: '/product/old-shirt' },
      { label: '2026 Shirt', href: '/product/new-shirt' },
      { label: 'Combo Pack', href: '/product/combo' },
      { label: 'Cart', href: '/cart' },
      { label: 'Track order', href: '/order-status' },
    ],
  },
  {
    title: 'Club',
    links: [
      { label: 'Main website', href: 'https://ultrashaheens.com' },
      { label: 'Our Dugout', href: 'https://ultrashaheens.com/our-dugout' },
      { label: 'Fundraising', href: 'https://ultrashaheens.com/fundraising' },
      { label: 'Constitution', href: 'https://ultrashaheens.com/constitution' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/ultra_shaheens/' },
      { label: 'X', href: 'https://x.com/ultrashaheens' },
      { label: 'Facebook', href: 'https://www.facebook.com/ultrashaheens/' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ultra-shaheens/' },
    ],
  },
]

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-dark text-paper border-t border-paper/10 px-[clamp(20px,4vw,48px)] pt-[clamp(56px,7vw,88px)] pb-8">
      <div className="wrap flex flex-col gap-14">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-10">
          <div className="flex flex-col gap-[18px] col-span-full min-w-0">
            <div className="relative w-[84px] h-[84px] overflow-hidden">
              <Image
                src="/images/brand/ultra-shaheens-logo.png"
                alt="Ultra Shaheens"
                width={116}
                height={116}
                className="absolute max-w-none w-[116px] h-[116px] -left-4 -top-4"
              />
            </div>
            <p className="m-0 text-[15px] leading-[1.6] text-paper/65 max-w-[380px]">
              Pakistan&apos;s most passionate football community. Our official shop lets you wear
              your passion and support the movement with pride.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <div className="font-display font-bold text-sm tracking-[0.18em] uppercase text-paper/50">
                {col.title}
              </div>
              {col.links.map((link) =>
                link.href.startsWith('http') ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper text-[15px] hover:text-canary"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className="text-paper text-[15px] hover:text-canary">
                    {link.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 pt-6 border-t border-paper/[0.14] text-[13px] text-paper/50">
          <span>© 2026 Ultra Shaheens. All rights reserved.</span>
          <span>
            Built for Pakistan football by{' '}
            <a
              href="https://www.talha.is-a.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/80 hover:text-canary"
            >
              Talha Sajid
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
