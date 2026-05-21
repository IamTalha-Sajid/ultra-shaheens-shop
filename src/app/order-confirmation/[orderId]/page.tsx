'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function OrderConfirmationPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const orderId = params.orderId as string
  const status = searchParams.get('status') ?? 'processing'
  const isPrepaid = status === 'pending'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05110a] via-[#0b1f13] to-[#040806] relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-dark-fern/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-dark-fern/10 rounded-full blur-[100px] pointer-events-none" />

      <Header />

      <div className="relative z-10 pt-40 sm:pt-48 pb-24 px-4 max-w-2xl mx-auto text-center">

        {/* Animated checkmark */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <svg
              className="w-24 h-24"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#f3f754"
                strokeWidth="4"
                strokeDasharray="283"
                strokeDashoffset="0"
                strokeLinecap="round"
                style={{
                  animation: 'drawCircle 0.6s ease-out forwards',
                }}
              />
              <path
                d="M28 52l14 14 30-30"
                stroke="#f3f754"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset="60"
                style={{
                  animation: 'drawCheck 0.4s ease-out 0.5s forwards',
                }}
              />
            </svg>
          </div>
        </div>

        <style>{`
          @keyframes drawCircle {
            from { stroke-dashoffset: 283; opacity: 0; }
            to { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes drawCheck {
            from { stroke-dashoffset: 60; }
            to { stroke-dashoffset: 0; }
          }
        `}</style>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl font-black uppercase tracking-widest text-white mb-2"
          style={{ fontFamily: '"din-condensed", sans-serif' }}
        >
          Order <span className="text-canary">Placed!</span>
        </h1>
        <p className="text-gray-400 mb-8">Thank you for your order.</p>

        {/* Order ID card */}
        <div className="bg-white/10 backdrop-blur-xl border border-[#f3f754]/40 rounded-3xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-2">Your Order ID</p>
          <p
            className="text-[#f3f754] font-black text-2xl sm:text-3xl tracking-widest"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            {orderId}
          </p>
          <p className="text-gray-500 text-xs mt-2">Save this for tracking your order</p>
        </div>

        {/* Status chip */}
        <div className="flex justify-center mb-8">
          {isPrepaid ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 font-bold text-sm uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Payment
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-sm uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Processing
            </span>
          )}
        </div>

        {/* What's next */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8 text-left">
          <h2
            className="text-lg font-black uppercase tracking-widest text-white mb-3"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            What&apos;s Next?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {isPrepaid
              ? 'Please transfer the payment and send a screenshot to WhatsApp. Your order will be confirmed once payment is verified.'
              : 'Our team will contact you shortly to confirm your delivery details.'}
          </p>
          <a
            href="https://wa.me/923247749121"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 py-3 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Contact Us on WhatsApp
          </a>
        </div>

        {/* Continue shopping */}
        <Link
          href="/"
          className="inline-block py-3 px-8 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
        >
          Continue Shopping
        </Link>
      </div>

      <Footer />
    </div>
  )
}
