'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cartContext'

const MAIN_SITE = 'https://ultrashaheens.com'

const navItems = [
  { label: 'Shop', href: '/' },
  { label: 'Track Order', href: '/order-status' },
  { label: 'Cart', href: '/cart' },
]

const Header: React.FC = () => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' || pathname.startsWith('/product') : pathname === href

  const countBadge = (
    <span className="min-w-5 h-5 px-1 flex items-center justify-center bg-canary text-ink-dark text-xs font-bold leading-none">
      {totalItems}
    </span>
  )

  return (
    <header className="sticky top-0 z-50 w-full text-paper bg-ink-dark border-t-[3px] border-t-canary border-b border-b-paper/[0.18] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 px-[clamp(20px,4vw,48px)] py-[14px]">
        <a
          href={MAIN_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-paper"
        >
          <div className="relative w-12 h-12 overflow-hidden flex-none">
            <Image
              src="/images/brand/ultra-shaheens-logo.png"
              alt="Ultra Shaheens"
              width={66}
              height={66}
              priority
              className="absolute max-w-none w-[66px] h-[66px] -left-[9px] -top-[9px]"
            />
          </div>
          <span className="font-display font-bold text-[20px] tracking-[0.08em] uppercase leading-none">
            <span className="hidden sm:inline">Ultra Shaheens</span>
            <span className="sm:ml-2 text-canary">Shop</span>
          </span>
        </a>

        <nav className="hidden min-[900px]:flex items-center gap-7 font-display font-semibold text-base tracking-[0.1em] uppercase">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 py-1 border-b-2 hover:text-canary ${
                isActive(item.href) ? 'text-canary border-canary' : 'text-paper border-transparent'
              }`}
            >
              {item.label}
              {item.href === '/cart' && totalItems > 0 && countBadge}
            </Link>
          ))}
          <a
            href={MAIN_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper/60 hover:text-canary py-1 border-b-2 border-transparent"
          >
            Main site ↗
          </a>
        </nav>

        <div className="min-[900px]:hidden flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Cart"
            className="h-12 px-3 flex items-center gap-2 border border-paper/30 bg-ink-dark/50 text-paper font-display font-semibold tracking-[0.1em] text-[13px] uppercase"
          >
            Cart
            {totalItems > 0 && countBadge}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="w-14 h-12 border border-paper/30 bg-ink-dark/50 text-paper font-display font-semibold tracking-[0.1em] text-[13px] uppercase cursor-pointer"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="min-[900px]:hidden bg-ink-dark border-t border-paper/[0.14] px-5 pt-2 pb-6 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex justify-between items-center py-4 border-b border-paper/10 font-display font-semibold text-[22px] tracking-[0.06em] uppercase ${
                isActive(item.href) ? 'text-canary' : 'text-paper'
              }`}
            >
              {item.label}
              {item.href === '/cart' && totalItems > 0 && countBadge}
            </Link>
          ))}
          <a
            href={MAIN_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between py-4 border-b border-paper/10 font-display font-semibold text-[22px] tracking-[0.06em] uppercase text-paper/70"
          >
            Main site <span>↗</span>
          </a>
        </div>
      )}
    </header>
  )
}

export default Header
