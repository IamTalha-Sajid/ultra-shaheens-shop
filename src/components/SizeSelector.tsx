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
          onClick={() => onSelect(size)}
          className={`py-2 px-3 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
            selected === size
              ? 'bg-canary text-racing-green border-canary'
              : 'bg-white/5 text-white border-white/20 hover:border-canary/50 hover:bg-white/10'
          }`}
          style={{ fontFamily: '"din-condensed", sans-serif' }}
        >
          {size}
        </button>
      ))}
    </div>
  )
}

export default SizeSelector
