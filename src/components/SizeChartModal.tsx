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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink-dark/80 overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Size chart for ${productName}`}
        className="relative bg-paper text-ink max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-ink/20">
          <h2 className="m-0 font-display font-extrabold uppercase text-[22px] leading-none">
            Size chart
            <span className="block mt-1 label text-muted-light">{productName}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex-none h-11 px-4 border-[1.5px] border-ink font-display font-bold text-sm tracking-[0.14em] uppercase hover:bg-ink hover:text-paper cursor-pointer"
          >
            Close
          </button>
        </div>

        <div className="p-3 bg-paper-2">
          <Image
            src={chartImage}
            alt={`Size chart for ${productName}`}
            width={600}
            height={450}
            className="w-full h-auto object-contain max-h-[55vh]"
          />
        </div>

        <p className="m-0 text-muted-light text-[13px] text-center py-4 px-5">
          Measurements are in inches. When between sizes, size up.
        </p>
      </div>
    </div>
  )
}

export default SizeChartModal
