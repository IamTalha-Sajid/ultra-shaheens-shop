'use client'

import React from 'react'

type SizeSelectorProps = {
  sizes: string[]
  selected: string | null
  onSelect: (size: string) => void
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          aria-pressed={selected === size}
          className={`h-11 border font-display font-semibold text-base tracking-[0.1em] uppercase cursor-pointer transition-colors ${
            selected === size
              ? 'bg-canary text-ink-dark border-canary'
              : 'bg-transparent text-paper border-paper/30 hover:border-paper'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  )
}

export default SizeSelector
