'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'

type Props = {
  open: boolean
  onClose: () => void
  chartImage: string
  productName: string
}

const SizeChartModal: React.FC<Props> = ({ open, onClose, chartImage, productName }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      style={{ top: '5rem' }}
      onClick={onClose}
    >
      <div
        className="relative bg-[#0b1f13] border border-white/20 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h2
            className="text-white font-black uppercase tracking-widest text-base"
            style={{ fontFamily: '"din-condensed", sans-serif' }}
          >
            Size Chart — <span className="text-canary">{productName}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2 transition-all duration-200"
            aria-label="Close size chart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="p-3">
          <div className="relative w-full rounded-xl overflow-hidden bg-white/5">
            <Image
              src={chartImage}
              alt={`Size chart for ${productName}`}
              width={600}
              height={450}
              className="w-full h-auto object-contain max-h-[55vh]"
            />
          </div>
        </div>

        <p className="text-gray-500 text-xs text-center pb-4 px-5">
          Measurements are in inches. When between sizes, size up.
        </p>
      </div>
    </div>
  )
}

export default SizeChartModal
