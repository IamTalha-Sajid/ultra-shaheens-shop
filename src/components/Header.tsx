'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCloseMobileMenu = () => {
    setIsClosing(true)
    setTimeout(() => {
      setMobileMenuOpen(false)
      setIsClosing(false)
    }, 300)
  }

  return (
    <header className="fixed w-full top-0 z-[100] transition-all duration-500 ease-in-out">
      {/* Top Bar */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          scrolled
            ? 'h-0 opacity-0'
            : 'h-auto opacity-100 bg-black/40 backdrop-blur-md border-b border-white/10'
        }`}
      >
        <div className="py-2 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
            <div
              className="text-sm sm:text-base font-bold tracking-widest text-white/80"
              style={{ fontFamily: '"din-condensed", sans-serif' }}
            >
              ULTRA SHAHEENS OFFICIAL SHOP
            </div>
            <div className="flex items-center space-x-3">
              <span
                className="text-xs sm:text-sm font-medium hidden sm:block text-canary"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                FOLLOW US
              </span>
              {[
                {
                  name: 'X',
                  url: 'https://x.com/ultrashaheens',
                  d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  name: 'Instagram',
                  url: 'https://www.instagram.com/ultra_shaheens/',
                  d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-canary transition-all duration-300 hover:scale-110"
                  aria-label={`Follow us on ${s.name}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Header */}
      <div className={`transition-all duration-500 ease-in-out px-4 ${scrolled ? 'pt-2' : 'pt-4'}`}>
        <div className="max-w-7xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50 pointer-events-none rounded-3xl overflow-hidden" />

          <div className="px-6 py-3 md:py-4 flex justify-between items-center relative z-10">
            {/* Logo — links to main site */}
            <div className="flex-shrink-0">
              <a href="https://ultrashaheens.com" target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-32 sm:w-40 md:w-48 h-10 sm:h-12 flex items-center justify-center">
                  <Image
                    src="/ultra-shaheens-logo.png"
                    alt="Ultra Shaheens Logo"
                    width={192}
                    height={112}
                    className="h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    priority
                  />
                </div>
              </a>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link
                href="/"
                className="text-canary font-semibold uppercase tracking-wider text-sm lg:text-base border-b-2 border-canary py-1"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                Shop
              </Link>
              <Link
                href="/order-status"
                className="flex items-center gap-1.5 text-white hover:text-canary font-semibold transition-all duration-300 uppercase tracking-wider text-sm lg:text-base border-b-2 border-transparent hover:border-canary py-1"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Track Order
              </Link>
              <Link
                href="/cart"
                className="relative flex items-center gap-2 text-white hover:text-canary font-semibold transition-all duration-300 uppercase tracking-wider text-sm lg:text-base border-b-2 border-transparent hover:border-canary py-1"
                style={{ fontFamily: '"din-condensed", sans-serif' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {totalItems > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-canary text-racing-green text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile: Cart icon + Hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <Link href="/cart" className="relative text-white hover:text-canary transition-colors p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-canary text-racing-green text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                className="text-white hover:text-canary transition-colors duration-200 p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm"
                onClick={() => {
                  if (mobileMenuOpen) handleCloseMobileMenu()
                  else setMobileMenuOpen(true)
                }}
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleCloseMobileMenu}
        >
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-black/70 backdrop-blur-xl border-l border-white/20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-in-out ${isClosing ? 'translate-x-full' : 'translate-x-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />
              <div className="flex items-center justify-between p-6 border-b border-white/20 relative z-10">
                <h2 className="text-xl font-bold text-white tracking-widest" style={{ fontFamily: '"din-condensed", sans-serif' }}>
                  MENU
                </h2>
                <button
                  onClick={handleCloseMobileMenu}
                  className="text-white hover:text-canary transition-colors bg-white/10 p-2 rounded-lg border border-white/20 hover:bg-white/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 relative z-10">
                <Link
                  href="/"
                  onClick={handleCloseMobileMenu}
                  className="block w-full p-4 rounded-xl border border-canary/40 bg-canary/10 text-canary font-semibold uppercase tracking-widest text-lg"
                  style={{ fontFamily: '"din-condensed", sans-serif' }}
                >
                  Shop
                </Link>
                <Link
                  href="/order-status"
                  onClick={handleCloseMobileMenu}
                  className="flex items-center gap-2 w-full p-4 rounded-xl border border-white/20 bg-white/15 backdrop-blur-xl text-white hover:text-canary font-semibold uppercase tracking-widest text-lg"
                  style={{ fontFamily: '"din-condensed", sans-serif' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Track Order
                </Link>
                <Link
                  href="/cart"
                  onClick={handleCloseMobileMenu}
                  className="flex items-center justify-between w-full p-4 rounded-xl border border-white/20 bg-white/15 backdrop-blur-xl text-white hover:text-canary font-semibold uppercase tracking-widest text-lg"
                  style={{ fontFamily: '"din-condensed", sans-serif' }}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                  </span>
                  {totalItems > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-canary text-racing-green text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
