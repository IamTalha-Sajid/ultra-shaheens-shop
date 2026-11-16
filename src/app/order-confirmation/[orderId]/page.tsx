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
    <div className="font-sans min-h-screen bg-ink-dark text-paper flex flex-col">
      <Header />

      <div className="page-pad flex-1">
        <div className="max-w-[720px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <div className="eyebrow flex items-center gap-3 text-canary">
              <span className="w-2 h-2 bg-canary" />
              Order received
            </div>
            <h1 className="h1-page">
              Order <span className="text-canary">placed!</span>
            </h1>
            <p className="m-0 text-lg text-paper/[0.78]">Thank you for your order.</p>
          </div>

          {/* Order ID */}
          <div className="border-y border-paper/20 py-6 flex flex-col gap-3">
            <p className="m-0 label text-paper/60">Your order ID</p>
            <p className="m-0 font-display font-extrabold text-[clamp(32px,5vw,48px)] leading-none text-canary tracking-[0.04em] break-all">
              {orderId}
            </p>
            <p className="m-0 text-sm text-paper/60">Save this for tracking your order.</p>
          </div>

          {/* Status */}
          <div className="flex">
            <span
              className={`px-3 py-1.5 font-display font-bold text-sm tracking-[0.14em] uppercase ${
                isPrepaid ? 'bg-canary text-ink-dark' : 'border border-paper/50 text-paper'
              }`}
            >
              {isPrepaid ? 'Pending payment' : 'Processing'}
            </span>
          </div>

          {/* What's next */}
          <div className="bg-paper text-ink p-[clamp(24px,3vw,32px)] flex flex-col gap-4">
            <h2 className="m-0 font-display font-extrabold uppercase text-[32px] leading-none">What&apos;s next?</h2>
            <p className="m-0 text-base leading-[1.6] text-body-light">
              {isPrepaid
                ? 'Please transfer the payment and send a screenshot to WhatsApp. Your order will be confirmed once payment is verified.'
                : 'Our team will contact you shortly to confirm your delivery details.'}
            </p>
            <div>
              <a
                href="https://wa.me/923247749121"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark !px-6 !py-3.5 !text-base"
              >
                Contact us on WhatsApp ↗
              </a>
            </div>
          </div>

          <div>
            <Link href="/" className="btn btn-secondary">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
